#!/usr/bin/env node

/**
 * Automated Setup Script for IO Tech Project
 * 
 * This script:
 * 1. Installs all dependencies (Frontend + Strapi)
 * 2. Starts Strapi server
 * 3. Waits for Strapi to be ready
 * 4. Starts Next.js application
 * 5. Opens browser automatically
 * 
 * Note: Data should be on your deployed server.
 * To seed data locally, run: cd strapi-backend && node scripts/seed-data.js
 */

const { execSync, spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const colors = {
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkNodeVersion() {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (majorVersion < 20) {
    log(`❌ Node.js version 20+ is required. Current version: ${nodeVersion}`, 'red');
    process.exit(1);
  }
  
  log(`✅ Node.js ${nodeVersion} detected`, 'green');
}

function installDependencies(dir, name) {
  const fullPath = path.join(process.cwd(), dir);
  
  if (!fs.existsSync(path.join(fullPath, 'node_modules'))) {
    log(`📦 Installing ${name} dependencies...`, 'yellow');
    try {
      execSync('npm install', { cwd: fullPath, stdio: 'inherit' });
      log(`✅ ${name} dependencies installed`, 'green');
    } catch (error) {
      log(`❌ Failed to install ${name} dependencies`, 'red');
      process.exit(1);
    }
  } else {
    log(`✅ ${name} dependencies already installed`, 'green');
  }
}

function waitForStrapi(maxAttempts = 60) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    const check = () => {
      attempts++;
      
      const req = http.get('http://localhost:1337/admin', (res) => {
        if (res.statusCode === 200 || res.statusCode === 302) {
          resolve();
        } else {
          if (attempts < maxAttempts) {
            setTimeout(check, 1000);
          } else {
            reject(new Error('Strapi failed to start'));
          }
        }
      });
      
      req.on('error', () => {
        if (attempts < maxAttempts) {
          process.stdout.write('.');
          setTimeout(check, 1000);
        } else {
          reject(new Error('Strapi failed to start'));
        }
      });
    };
    
    check();
  });
}

function killExistingProcesses() {
  try {
    // Kill existing Strapi processes
    if (process.platform === 'win32') {
      execSync('taskkill /F /IM node.exe /FI "WINDOWTITLE eq strapi*" 2>nul', { stdio: 'ignore' });
    } else {
      execSync('pkill -f "strapi develop" 2>/dev/null || true', { stdio: 'ignore' });
    }
  } catch (error) {
    // Ignore errors
  }
}

function startStrapi() {
  log('🚀 Starting Strapi server...', 'yellow');
  
  killExistingProcesses();
  
  const strapiPath = path.join(process.cwd(), 'strapi-backend');
  const logFile = path.join(process.cwd(), 'strapi.log');
  
  // Start Strapi
  const strapiProcess = spawn('npm', ['run', 'develop'], {
    cwd: strapiPath,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true
  });
  
  // Save PID
  fs.writeFileSync(path.join(process.cwd(), 'strapi.pid'), strapiProcess.pid.toString());
  
  // Log output to file
  const logStream = fs.createWriteStream(logFile);
  strapiProcess.stdout.pipe(logStream);
  strapiProcess.stderr.pipe(logStream);
  
  log('⏳ Waiting for Strapi to start (this may take 30-60 seconds)...', 'yellow');
  
  return waitForStrapi()
    .then(() => {
      log('✅ Strapi is running on http://localhost:1337', 'green');
      return strapiProcess;
    })
    .catch((error) => {
      log(`❌ ${error.message}. Check strapi.log for details.`, 'red');
      strapiProcess.kill();
      process.exit(1);
    });
}


function openBrowser() {
  setTimeout(() => {
    const url = 'http://localhost:3000';
    let command;
    
    if (process.platform === 'win32') {
      command = `start ${url}`;
    } else if (process.platform === 'darwin') {
      command = `open ${url}`;
    } else {
      command = `xdg-open ${url}`;
    }
    
    try {
      execSync(command, { stdio: 'ignore' });
    } catch (error) {
      // Ignore errors
    }
  }, 3000);
}

function startNextjs() {
  log('🚀 Starting Next.js application...', 'yellow');
  log('', 'reset');
  log('========================================', 'green');
  log('  Setup Complete!', 'green');
  log('========================================', 'green');
  log('', 'reset');
  log('📱 Frontend: http://localhost:3000', 'blue');
  log('🔧 Strapi Admin: http://localhost:1337/admin', 'blue');
  log('', 'reset');
  log('Starting Next.js server...', 'yellow');
  log('Press Ctrl+C to stop all servers', 'yellow');
  log('', 'reset');
  
  openBrowser();
  
  // Start Next.js
  const nextProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true
  });
  
  // Cleanup on exit
  process.on('SIGINT', () => {
    log('\nStopping servers...', 'yellow');
    try {
      const pid = fs.readFileSync(path.join(process.cwd(), 'strapi.pid'), 'utf8');
      if (process.platform === 'win32') {
        execSync(`taskkill /F /PID ${pid} 2>nul`, { stdio: 'ignore' });
      } else {
        execSync(`kill ${pid} 2>/dev/null`, { stdio: 'ignore' });
      }
      fs.unlinkSync(path.join(process.cwd(), 'strapi.pid'));
    } catch (error) {
      // Ignore errors
    }
    process.exit(0);
  });
  
  nextProcess.on('exit', () => {
    try {
      const pid = fs.readFileSync(path.join(process.cwd(), 'strapi.pid'), 'utf8');
      if (process.platform === 'win32') {
        execSync(`taskkill /F /PID ${pid} 2>nul`, { stdio: 'ignore' });
      } else {
        execSync(`kill ${pid} 2>/dev/null`, { stdio: 'ignore' });
      }
      fs.unlinkSync(path.join(process.cwd(), 'strapi.pid'));
    } catch (error) {
      // Ignore errors
    }
  });
}

// Main execution
async function main() {
  log('========================================', 'blue');
  log('  IO Tech - Automated Setup Script', 'blue');
  log('========================================', 'blue');
  log('', 'reset');
  
  checkNodeVersion();
  log('', 'reset');
  
  log('📦 Step 1/4: Installing Frontend dependencies...', 'yellow');
  installDependencies('.', 'Frontend');
  log('', 'reset');
  
  log('📦 Step 2/4: Installing Strapi dependencies...', 'yellow');
  installDependencies('strapi-backend', 'Strapi');
  log('', 'reset');
  
  log('🚀 Step 3/4: Starting Strapi server...', 'yellow');
  const strapiProcess = await startStrapi();
  log('', 'reset');
  
  log('🚀 Step 4/4: Starting Next.js application...', 'yellow');
  log('', 'reset');
  log('💡 Note: Data should be on your deployed server.', 'yellow');
  log('💡 To seed data locally: cd strapi-backend && node scripts/seed-data.js', 'yellow');
  log('', 'reset');
  startNextjs();
}

main().catch((error) => {
  log(`❌ Setup failed: ${error.message}`, 'red');
  process.exit(1);
});
