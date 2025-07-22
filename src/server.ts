import express, { Request, Response } from 'express';
import path from 'path';
import { exec } from 'child_process';
import glob from 'glob';
import fs from 'fs';

const app = express();
const port = 3000;

const projectRoot = process.cwd();
const publicPath = path.resolve(projectRoot, 'public');
const playwrightReportPath = path.resolve(projectRoot, 'playwright-report');
const testResultsPath = path.resolve(projectRoot, 'test-results');

console.log('Servidor iniciando...');
console.log(`Raíz del proyecto: ${projectRoot}`);
console.log(`Ruta pública: ${publicPath}`);
console.log(`Ruta del reporte de Playwright: ${playwrightReportPath}`);
console.log(`Ruta de resultados de prueba (artefactos): ${testResultsPath}`);

app.use(express.json());
app.use(express.static(publicPath));
app.use('/playwright-report-view', express.static(playwrightReportPath));
app.use('/test-artifacts', express.static(testResultsPath));

app.get('/available-tests', (req: Request, res: Response) => {
    console.log('Solicitud recibida para /available-tests');
    const testSpecsGlobPattern = path.join(projectRoot, 'src/tests/**/*.spec.ts');
    console.log(`Buscando pruebas con patrón glob: ${testSpecsGlobPattern}`);

    glob(testSpecsGlobPattern, (err, files) => {
        if (err) {
            console.error('Error al buscar archivos de prueba:', err);
            return res.status(500).json({ error: err.message });
        }

        console.log(`Se encontraron ${files.length} archivos de prueba.`);
        if (files.length > 0) {
            console.log('Archivos encontrados:', files);
        } else {
            console.log('No se encontraron archivos de prueba con el patrón especificado. Asegúrate de que los archivos estén en "src/tests" y terminen en .spec.ts');
        }

        const tests = files.map(file => ({
            name: path.basename(file, '.spec.ts'),
            path: path.relative(projectRoot, file)
        }));

        res.json(tests);
    });
});

app.post('/run-tests', (req: Request, res: Response) => {
    console.log('Solicitud recibida para /run-tests');
    const { type, specs } = req.body;

    if (!specs || specs.length === 0) {
        return res.status(400).json({ error: 'No se proporcionaron pruebas para ejecutar' });
    }

    const absoluteSpecs = specs.map((s: string) => path.resolve(projectRoot, s));

    const command = `npx playwright ${type} ${absoluteSpecs.join(' ')} --reporter=html`;
    console.log(`Ejecutando comando: ${command}`);

    exec(command, { cwd: projectRoot }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error de ejecución: ${error}`);
            if (stderr.includes('No tests found') || stderr.includes('Error: No tests were found')) {
                return res.status(400).send(`Error de Playwright: ${stderr}`);
            }
            return res.status(500).send(stderr || error.message);
        }

        const lastRunData = {
            status: stderr ? 'fallido' : 'correcto',
            failedTests: stderr ? [stderr] : []
        };
        if (!fs.existsSync(testResultsPath)) {
            console.log(`Creando directorio de resultados: ${testResultsPath}`);
            fs.mkdirSync(testResultsPath, { recursive: true });
        }
        fs.writeFileSync(
            path.join(testResultsPath, '.last-run.json'),
            JSON.stringify(lastRunData, null, 2)
        );

        res.send(stdout || 'Pruebas completadas exitosamente');
    });
});

app.get('/report', (req: Request, res: Response) => {
    console.log('Solicitud recibida para /report');
    res.sendFile(path.join(playwrightReportPath, 'index.html'));
});

app.get('/list-artifacts', (req: Request, res: Response) => {
    console.log('Solicitud recibida para /list-artifacts');
    const artifactList: { name: string; path: string; url: string; type: string }[] = [];

    const htmlReportPath = path.join(playwrightReportPath, 'index.html');
    if (fs.existsSync(htmlReportPath)) {
        console.log(`Reporte HTML de Playwright encontrado: ${htmlReportPath}`);
        artifactList.push({
            name: 'Reporte HTML de Playwright',
            path: 'playwright-report/index.html',
            url: '/playwright-report-view/index.html',
            type: 'reporte'
        });
    } else {
        console.log(`Reporte HTML de Playwright no encontrado en: ${htmlReportPath}`);
    }

    if (!fs.existsSync(testResultsPath)) {
        console.log(`El directorio de resultados de prueba no existe: ${testResultsPath}. No hay artefactos para mostrar.`);
    } else {
        fs.readdir(testResultsPath, { withFileTypes: true, recursive: true }, (err, files) => {
            if (err) {
                console.error(`Error al leer el directorio de resultados (${testResultsPath}):`, err);
                return res.status(500).json({ error: 'Error del servidor al listar artefactos.' });
            }

            if (files) {
                for (const file of files) {
                    if (file.isFile() && file.name !== '.last-run.json') {
                        const relativePath = path.relative(testResultsPath, path.join(file.path, file.name));
                        artifactList.push({
                            name: file.name,
                            path: relativePath,
                            url: `/test-artifacts/${relativePath.replace(/\\/g, '/')}`,
                            type: 'artefacto'
                        });
                    }
                }
            }

            console.log(`Se encontraron ${artifactList.length - (htmlReportPath && fs.existsSync(htmlReportPath) ? 1 : 0)} artefactos en bruto en ${testResultsPath}. Total: ${artifactList.length}`);
            res.json(artifactList);
        });
        return;
    }

    res.json(artifactList);
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
    console.log('Esperando solicitudes...');
});
