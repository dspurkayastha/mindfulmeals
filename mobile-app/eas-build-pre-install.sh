#!/bin/bash
set -e

echo "🔧 EAS Pre-install: Preparing monorepo build environment"

# Check if we're in EAS build environment
if [ "$EAS_BUILD" = "true" ]; then
  echo "📦 Detected EAS build environment"
  
  # For Android builds, we need to handle the monorepo structure
  if [ "$EAS_BUILD_PLATFORM" = "android" ]; then
    echo "🤖 Configuring for Android build..."
    
    # Remove .npmrc temporarily to allow EAS to handle dependencies
    if [ -f ".npmrc" ]; then
      mv .npmrc .npmrc.backup
    fi
    
    # Create a simplified package.json without workspace references
    echo "📝 Creating standalone package configuration..."
    node -e "
      const pkg = require('./package.json');
      delete pkg.workspaces;
      delete pkg.prepare;
      // Simplify scripts
      pkg.scripts = {
        ...pkg.scripts,
        postinstall: 'patch-package || true',
        prepare: 'echo \"Skipping prepare in EAS\"'
      };
      require('fs').writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
    "
    
    # Remove the minimal package-lock.json to let EAS generate a proper one
    if [ -f "package-lock.json" ]; then
      rm -f package-lock.json
    fi
    
    echo "✅ Android build preparation complete"
  else
    echo "🍎 iOS build - using standard configuration"
  fi
  
  # Ensure patches directory exists
  if [ -d "patches" ]; then
    echo "✅ Patches directory found"
  fi
  
  echo "✅ Pre-install setup complete"
else
  echo "📱 Local development environment detected"
fi