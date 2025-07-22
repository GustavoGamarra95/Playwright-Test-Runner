const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

async function setup() {
  console.log('Iniciando configuración multiplataforma...');

  const dirs = [
    'src/tests',
    'playwright-report',
    'test-results',
    'public',
    'browsers'
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✓ Creado directorio: ${dir}`);
    }
  });

  try {
    const platform = os.platform();
    let packageManager = '';
    let installCommand = '';

    if (platform === 'linux') {
      if (commandExists('apt-get')) {
        packageManager = 'apt';
        installCommand = 'sudo apt-get update && sudo apt-get install -y --no-install-recommends chromium-browser chromium-codecs-ffmpeg-extra ca-certificates fonts-liberation libasound2 libatk-bridge2.0-0 libatk1.0-0 libatspi2.0-0 libcairo2 libcups2 libdbus-1-3 libdrm2 libgbm1 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libx11-6 libxcb1 libxcomposite1 libxdamage1 libxext6 libxfixes3 libxrandr2 libxshmfence1 xdg-utils';
      } else if (commandExists('pacman')) {
        packageManager = 'pacman';
        installCommand = 'sudo pacman -S --needed --noconfirm chromium nss alsa-lib at-spi2-core cairo dbus glib2 gtk3 libcups libx11 libxcomposite libxdamage libxext libxfixes libxrandr libxss mesa pango';
      } else if (commandExists('dnf')) {
        packageManager = 'dnf';
        installCommand = 'sudo dnf install -y chromium chromium-headless chromium-libs nss alsa-lib at-spi2-core cairo cups-libs dbus-libs gtk3 libX11 libXcomposite libXdamage libXext libXfixes libXrandr mesa-libgbm pango';
      }

      if (packageManager) {
        console.log(`🔧 Instalando dependencias usando ${packageManager}...`);
        try {
          execSync(installCommand, { stdio: 'inherit' });
        } catch (err) {
          console.log('Error instalando dependencias del sistema. Continuando...');
        }
      }
    }

    console.log('Instalando navegador Chromium...');
    execSync('npx playwright install chromium', { stdio: 'inherit' });

    const envConfig = {
      PLAYWRIGHT_BROWSERS_PATH: path.join(process.cwd(), 'browsers'),
      PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: '0',
      PLAYWRIGHT_CHROMIUM_PATH: path.join(process.cwd(), 'browsers', 'chromium'),
      NODE_ENV: 'production',
      PORT: '1440'
    };

    const envContent = Object.entries(envConfig)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    fs.writeFileSync('.env', envContent);

    const scriptName = platform === 'win32' ? 'start.bat' : 'start.sh';
    const scriptContent = platform === 'win32'
      ? `@echo off
set PLAYWRIGHT_BROWSERS_PATH=./browsers
set PORT=1440
node dist/server.js`
      : `#!/bin/bash
export PLAYWRIGHT_BROWSERS_PATH=./browsers
export PORT=1440
node dist/server.js`;

    fs.writeFileSync(scriptName, scriptContent);

    if (platform !== 'win32') {
      fs.chmodSync(scriptName, '755');
    }

    console.log('\nConfiguración completada exitosamente!');
    console.log(`Sistema detectado: ${platform}${packageManager ? ` (${packageManager})` : ''}`);
    console.log('Para iniciar el servidor:');
    console.log(platform === 'win32' ? '- Ejecute start.bat' : '- Ejecute ./start.sh');

  } catch (error) {
    console.error('❌ Error durante la configuración:', error.message);
    process.exit(1);
  }
}

function commandExists(command) {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

setup();
