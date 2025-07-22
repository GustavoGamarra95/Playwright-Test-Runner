let availableTestNamesMap = new Map();

document.addEventListener('DOMContentLoaded', () => {
    console.log('Contenido del DOM cargado. Inicializando...');
    loadTests();
    const artifactListDiv = document.getElementById('artifactList');
    if (artifactListDiv) {
        artifactListDiv.textContent = 'Aún no se han generado artefactos. Ejecuta pruebas para ver resultados.';
    }
});

async function loadTests() {
    console.log('Cargando pruebas disponibles...');
    try {
        const response = await fetch('/available-tests');
        if (!response.ok) {
            throw new Error(`Error HTTP! Estado: ${response.status}`);
        }
        const tests = await response.json();
        console.log('Pruebas disponibles obtenidas:', tests);
        tests.forEach(test => {
            const baseFileName = path.basename(test.path, '.spec.ts');
            availableTestNamesMap.set(baseFileName.toLowerCase(), test.name);
        });
        console.log('Nombres de pruebas mapeados:', availableTestNamesMap);
        displayTests(tests);
    } catch (error) {
        showStatus('Error al cargar las pruebas: ' + error.message, 'error');
        console.error('Error al obtener las pruebas disponibles:', error);
    }
}

function displayTests(tests) {
    const testList = document.getElementById('testList');
    if (!testList) return;

    testList.innerHTML = '';

    if (tests.length === 0) {
        testList.textContent = 'No se encontraron archivos de prueba.';
        return;
    }

    testList.innerHTML = tests.map(test => `
        <div class="test-item">
            <input type="checkbox" id="${test.path}" value="${test.path}">
            <label for="${test.path}">${test.name}</label>
        </div>
    `).join('');
    console.log('Pruebas mostradas en la interfaz.');
}

function selectAllTests() {
    const checkboxes = document.querySelectorAll('#testList input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.checked = true);
    console.log('Todas las pruebas seleccionadas.');
}

function deselectAllTests() {
    const checkboxes = document.querySelectorAll('#testList input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.checked = false);
    console.log('Todas las pruebas deseleccionadas.');
}

async function runSelectedTests(type) {
    const checkboxes = document.querySelectorAll('#testList input[type="checkbox"]:checked');
    const selectedTests = Array.from(checkboxes).map(cb => cb.value);

    console.log('Intentando ejecutar pruebas seleccionadas. Tipo:', type, 'Especificaciones:', selectedTests);

    if (selectedTests.length === 0) {
        showStatus('Por favor, selecciona al menos una prueba para ejecutar', 'error');
        return;
    }

    showStatus('Ejecutando pruebas...', 'pending');
    const testOutput = document.getElementById('testOutput');
    if (testOutput) testOutput.textContent = 'Ejecutando pruebas... Por favor, espera...';

    const artifactListDiv = document.getElementById('artifactList');
    if (artifactListDiv) {
        artifactListDiv.innerHTML = '';
        artifactListDiv.textContent = 'Generando artefactos...';
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutos

    try {
        console.log('Enviando solicitud /run-tests al servidor...');
        const response = await fetch('/run-tests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ type, specs: selectedTests }),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        console.log('Respuesta recibida de /run-tests:', response);
        console.log('Estado:', response.status, 'OK:', response.ok);

        const rawResponseText = await response.text();
        console.log('Texto de respuesta:', rawResponseText);

        if (!response.ok) {
            console.error('El servidor respondió con un error:', rawResponseText);
            throw new Error(`Error del servidor (${response.status}): ${rawResponseText || 'Error desconocido'}`);
        }

        if (testOutput) testOutput.textContent = rawResponseText;
        showStatus('Pruebas completadas con éxito', 'success');
        console.log('Pruebas completadas. Cargando artefactos...');
        loadArtifacts();
    } catch (error) {
        clearTimeout(timeoutId);
        console.error('Error al ejecutar pruebas o al cargar artefactos:', error);

        let errorMessage = error.message || 'Ocurrió un error desconocido.';
        if (error.name === 'AbortError') {
            errorMessage = 'Tiempo de espera agotado. El servidor tardó demasiado en responder.';
        }

        if (testOutput) testOutput.textContent = `Error: ${errorMessage}`;
        showStatus('Error al ejecutar las pruebas: ' + errorMessage, 'error');
        if (artifactListDiv) {
            artifactListDiv.textContent = 'No se pudieron generar artefactos debido a un error en la prueba o un problema de red.';
        }
    }
}

function runAllTests() {
    console.log('Ejecutando todas las pruebas...');
    selectAllTests();
    runSelectedTests('test');
}

function viewReport() {
    console.log('Abriendo reporte...');
    window.open('/playwright-report-view/index.html', '_blank');
}

function showStatus(message, type) {
    const statusDiv = document.getElementById('status');
    if (!statusDiv) return;

    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    console.log(`Estado actualizado: ${message} (${type})`);
}

function groupArtifactsByTest(artifacts) {
    console.log('Agrupando artefactos por prueba...');
    const grouped = new Map();

    const htmlReport = artifacts.find(a => a.type === 'report');
    if (htmlReport) {
        console.log('Reporte HTML encontrado:', htmlReport);
    }

    artifacts.forEach(artifact => {
        if (artifact.type === 'artifact') {
            const pathParts = artifact.path.split(path.sep);
            const playwrightGeneratedDir = pathParts[0];

            let primaryTestName = 'Otros Artefactos';

            for (const [baseFileNameLower, originalTestName] of availableTestNamesMap.entries()) {
                if (playwrightGeneratedDir.toLowerCase().includes(baseFileNameLower)) {
                    primaryTestName = originalTestName;
                    break;
                }
            }

            if (!grouped.has(primaryTestName)) {
                grouped.set(primaryTestName, new Map());
            }

            const testFileMap = grouped.get(primaryTestName);
            if (!testFileMap.has(playwrightGeneratedDir)) {
                testFileMap.set(playwrightGeneratedDir, []);
            }
            testFileMap.get(playwrightGeneratedDir).push(artifact);
        }
    });

    if (htmlReport) {
        grouped.forEach((testFileMap, primaryTestName) => {
            const reportSubgroupName = 'Reporte Playwright';
            if (!testFileMap.has(reportSubgroupName)) {
                testFileMap.set(reportSubgroupName, []);
            }
            testFileMap.get(reportSubgroupName).push(htmlReport);
        });
    }
    console.log('Artefactos agrupados:', grouped);
    return grouped;
}

async function loadArtifacts() {
    console.log('Obteniendo artefactos desde /list-artifacts...');
    try {
        const response = await fetch('/list-artifacts');
        if (!response.ok) {
            throw new Error(`Error HTTP! Estado: ${response.status}`);
        }
        const artifacts = await response.json();
        console.log('Artefactos crudos del servidor:', artifacts);
        const artifactListDiv = document.getElementById('artifactList');
        if (!artifactListDiv) return;

        artifactListDiv.innerHTML = '';

        if (artifacts.length === 0) {
            artifactListDiv.textContent = 'No se generaron artefactos para esta ejecución.';
            console.log('No hay artefactos que mostrar.');
            return;
        }

        const groupedArtifacts = groupArtifactsByTest(artifacts);

        let htmlContent = '';
        const sortedPrimaryGroups = Array.from(groupedArtifacts.keys()).sort();

        sortedPrimaryGroups.forEach(testFileName => {
            const testFileGroups = groupedArtifacts.get(testFileName);
            htmlContent += `
                <details class="artifact-group">
                    <summary class="artifact-group-summary">${testFileName}</summary>
                    <div class="artifact-group-content">
            `;

            const sortedSubGroups = Array.from(testFileGroups.keys()).sort();

            sortedSubGroups.forEach(dirName => {
                const artifactsInDir = testFileGroups.get(dirName);
                artifactsInDir.sort((a, b) => a.path.localeCompare(b.path));

                htmlContent += `
                    <details class="artifact-sub-group">
                        <summary class="artifact-sub-group-summary">${dirName}</summary>
                        <div class="artifact-sub-group-content">
                `;
                artifactsInDir.forEach(artifact => {
                    let displayName = artifact.name;
                    if (artifact.type === 'artifact') {
                        displayName = path.basename(artifact.path);
                        const parts = artifact.path.split(path.sep);
                        if (parts.length >= 2) {
                            const potentialBrowserName = parts[parts.length - 2].toLowerCase();
                            if (potentialBrowserName.includes('chromium') || potentialBrowserName.includes('firefox') || potentialBrowserName.includes('webkit')) {
                                displayName = `${parts[parts.length - 2]}/${parts[parts.length - 1]}`;
                            }
                        }
                    }

                    htmlContent += `
                        <div class="artifact-item">
                            <a href="${artifact.url}" target="_blank">${displayName}</a>
                        </div>
                    `;
                });
                htmlContent += `
                        </div>
                    </details>
                `;
            });
            htmlContent += `
                    </div>
                </details>
            `;
        });
        artifactListDiv.innerHTML = htmlContent;
        console.log('Artefactos mostrados en la interfaz.');
    } catch (error) {
        console.error('Error al cargar artefactos:', error);
        const artifactListDiv = document.getElementById('artifactList');
        if (artifactListDiv) artifactListDiv.textContent = 'Error al cargar los artefactos: ' + error.message;
    }
}

const path = {
    sep: '/',
    basename: (p, ext) => {
        const filename = p.split('/').pop();
        if (ext && filename.endsWith(ext)) {
            return filename.substring(0, filename.length - ext.length);
        }
        return filename;
    }
};
