# Playwright Test Runner

Un servidor Node.js que gestiona y ejecuta pruebas de Playwright a través de una interfaz API REST.

## Características

- Listar especificaciones de pruebas disponibles
- Ejecutar pruebas de Playwright
- Ver reportes y artefactos de pruebas
- Servir resultados y reportes de pruebas estáticos

## Instalación

```bash
npm install
npm run build
```

## Uso
Iniciar el servidor:

```bash
npm start
```
El servidor escuchará en el puerto 3000 por defecto. Puedes cambiar el puerto configurando la variable de entorno `PORT`.

## Endpoints de la API

```bash
GET /available-tests
```
Lista todas las especificaciones de pruebas disponibles en el directorio src/tests.

```bash
POST /run-tests
```
Ejecuta las pruebas de Playwright especificadas.
```bash
{
  "type": "test",
  "specs": ["ruta/al/test.spec.ts"]
}
```
```bash
GET /report
```
Devuelve el reporte HTML de Playwright.
```bash
GET /list-artifacts
```
Lista todos los artefactos y reportes de pruebas.

## Estructura de Directorios
```bash 
/src/tests - Especificaciones de pruebas
/playwright-report - Reportes HTML
/test-results - Artefactos y resultados de pruebas
/public - Archivos estáticos
```
## Requisitos
- Node.js
- TypeScript
- Playwright
- Express
## Entorno
El servidor espera la siguiente estructura de directorios:
- Raíz del proyecto conteniendo las especificaciones de pruebas
- Directorio playwright-report para reportes HTML
- Directorio test-results para artefactos de pruebas
## Notas
- Los archivos de prueba deben usar la extensión .spec.ts
- Los reportes se generan en formato HTML
- 3Los artefactos de prueba se conservan y se sirven de forma estátic
