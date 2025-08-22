#!/bin/bash
set -e

echo "🔧 EAS Pre-install: Preparing monorepo build environment"

# Check if we're in EAS build environment
if [ "$EAS_BUILD" = "true" ]; then
  echo "📦 Detected EAS build environment"
  
  # Remove .npmrc that might have workspace config
  if [ -f ".npmrc" ]; then
    echo "🔧 Removing .npmrc to avoid workspace conflicts"
    rm -f .npmrc
  fi
  
  # For Android builds, we need to handle the monorepo structure
  if [ "$EAS_BUILD_PLATFORM" = "android" ]; then
    echo "🤖 Configuring for Android build..."
    
    # Create a simplified package.json without workspace references
    echo "📝 Creating standalone package configuration..."
    node -e "
      const fs = require('fs');
      const pkg = require('./package.json');
      
      // Remove any workspace-related fields
      delete pkg.workspaces;
      delete pkg.prepare;
      
      // Ensure npm doesn't try to use workspaces
      pkg.scripts = {
        ...pkg.scripts,
        postinstall: 'patch-package || true',
        prepare: 'echo \"Skipping prepare in EAS\"'
      };
      
      // Write the modified package.json
      fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
      console.log('✅ package.json updated for standalone build');
    "
    
    # Create a simple .npmrc to ensure no workspace features
    echo "📝 Creating EAS-specific .npmrc"
    cat > .npmrc << EOF
# EAS Build Configuration
workspaces=false
legacy-peer-deps=true
fetch-timeout=600000
fetch-retries=10
EOF
    
    echo "✅ Android build preparation complete"
  else
    echo "🍎 iOS build - using standard configuration"
    
    # For iOS, just ensure no workspace conflicts
    if [ -f "../package.json" ]; then
      echo "📦 Parent package.json detected, ensuring standalone build"
      
      # Create minimal .npmrc
      echo "workspaces=false" > .npmrc
      echo "legacy-peer-deps=true" >> .npmrc
    fi
  fi
  
  # Ensure patches directory exists
  if [ -d "patches" ]; then
    echo "✅ Patches directory found"
  else
    echo "⚠️  No patches directory found"
  fi
  
  # Remove any existing node_modules to ensure clean install
  if [ -d "node_modules" ]; then
    echo "🧹 Cleaning existing node_modules"
    rm -rf node_modules
  fi
  
  # Remove package-lock.json to let EAS generate fresh one
  if [ -f "package-lock.json" ]; then
    echo "🔒 Removing existing package-lock.json"
    rm -f package-lock.json
  fi
  
  echo "✅ Pre-install setup complete"
else
  echo "📱 Local development environment detected - skipping EAS setup"
fi