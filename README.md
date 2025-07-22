# Playwright Test Runner

## Descripción
Servidor Node.js que gestiona y ejecuta pruebas de Playwright a través de una interfaz web y API REST.

## Requisitos
- Node.js v20.19.1 o superior
- npm v10.8.2 o superior
- Sistema operativo compatible: Linux, Windows o macOS

## Instalación

1. Clonar el repositorio:
```bash
https://github.com/GustavoGamarra95/Playwright-Test-Runner.git
cd Playwright-Test-Runner
```
2. Instalar las dependencias:
```bash
npm install
```
3. Características
- Interfaz web para ejecutar pruebas
- API REST para integración
- Visualización de reportes en tiempo real
- Ejecución de pruebas en modo headless y headed
- Puerto por defecto: 1440

## Endpoints de la API
```bash
GET /available-tests
# Lista las especificaciones de pruebas disponibles

POST /run-tests
# Ejecuta pruebas específicas
{
  "type": "test",
  "specs": ["ruta/al/test.spec.ts"]
}

GET /report
# Obtiene el reporte HTML

GET /list-artifacts
# Lista los artefactos generados
```
## Scripts Disponibles
- npm run build - Compila el proyecto TypeScript
- npm start - Inicia el servidor
- npm run dev - Inicia el servidor en modo desarrollo
- npm test - Ejecuta pruebas en modo headless
- npm run test:headed - Ejecuta pruebas en modo gráfico
- npm run test:ui - Ejecuta pruebas con interfaz de usuario
- npm run report - Muestra el reporte de pruebas
- npm run setup - Configura el entorno

## Estructura del Proyecto
```bash
├── src/
│   ├── tests/         # Pruebas de Playwright
│   │   └── specs/     # Especificaciones de pruebas
│   ├── pages/         # Page Objects
│   └── data/          # Datos de prueba
├── public/            # Archivos estáticos
├── playwright-report/ # Reportes de pruebas
├── test-results/      # Resultados y artefactos
└── browsers/          # Navegadores instalados
```
## Uso
1. Iniciar el servidor:

```bash
./start.sh  # En Linux
start.bat   # En Windows
```
2. Acceder a la interfaz web:
```bash
 http://localhost:1440
``` 

## Notas
- Los archivos de prueba deben usar la extensión .spec.ts
- Los reportes se generan en formato HTML
- Los artefactos de prueba se conservan y se sirven de forma estátic
