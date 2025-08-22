#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Preparing EAS build for monorepo...');

// Read the mobile-app package.json
const packagePath = path.join(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Read root package-lock.json if it exists
const rootLockPath = path.join(__dirname, '..', '..', 'package-lock.json');
const mobileLockPath = path.join(__dirname, '..', 'package-lock.json');

if (fs.existsSync(rootLockPath) && !fs.existsSync(mobileLockPath)) {
  console.log('📦 Creating package-lock.json from workspace root...');
  
  const rootLock = JSON.parse(fs.readFileSync(rootLockPath, 'utf8'));
  
  // Extract only the dependencies relevant to mobile-app
  const mobileLock = {
    name: pkg.name,
    version: pkg.version,
    lockfileVersion: rootLock.lockfileVersion,
    requires: true,
    packages: {
      "": {
        name: pkg.name,
        version: pkg.version,
        dependencies: pkg.dependencies,
        devDependencies: pkg.devDependencies
      }
    },
    dependencies: {}
  };

  // Filter dependencies from root lock
  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
  
  Object.keys(allDeps).forEach(dep => {
    if (rootLock.dependencies && rootLock.dependencies[dep]) {
      mobileLock.dependencies[dep] = rootLock.dependencies[dep];
    }
  });

  fs.writeFileSync(mobileLockPath, JSON.stringify(mobileLock, null, 2));
  console.log('✅ Created package-lock.json for mobile-app');
}

// Update package.json to remove workspace references
const standalonePackage = { ...pkg };
delete standalonePackage.workspaces;

// Ensure scripts are properly set
standalonePackage.scripts = standalonePackage.scripts || {};
standalonePackage.scripts.postinstall = 'patch-package || true';

fs.writeFileSync(packagePath + '.standalone', JSON.stringify(standalonePackage, null, 2));

console.log('✅ EAS build preparation complete!');