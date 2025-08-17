# React Native Monorepo Fix Plan

## Overview
This plan addresses all the build issues encountered and provides sustainable solutions for a properly functioning React Native monorepo with iOS and Android support.

## Phase 1: Restructure and Initialize Native Projects (Day 1)

### 1.1 Generate Proper Native Projects
Instead of manual fixes, regenerate the native projects with proper monorepo structure:

```bash
# Step 1: Backup current mobile-app
cp -r mobile-app mobile-app-backup

# Step 2: Create temporary RN project
cd /tmp
npx react-native@0.72.6 init MindfulMealsTemp --template react-native-template-typescript

# Step 3: Copy native folders with monorepo adjustments
cp -r MindfulMealsTemp/ios ~/workspace/mobile-app/
cp -r MindfulMealsTemp/android ~/workspace/mobile-app/
```

### 1.2 Fix Native Project References
Update all paths to account for monorepo structure:

#### iOS Fixes:
```ruby
# mobile-app/ios/Podfile
require_relative '../../../node_modules/react-native/scripts/react_native_pods'
require_relative '../../../node_modules/@react-native-community/cli-platform-ios/native_modules'

platform :ios, '12.4'
install! 'cocoapods', :deterministic_uuids => false

target 'MindfulMeals' do
  config = use_native_modules!

  # Flags change depending on the env values.
  flags = get_default_flags()

  use_react_native!(
    :path => '../../../node_modules/react-native',
    :hermes_enabled => flags[:hermes_enabled],
    :fabric_enabled => flags[:fabric_enabled],
    :app_path => "#{Pod::Config.instance.installation_root}/.."
  )

  # Fix for monorepo
  post_install do |installer|
    react_native_post_install(
      installer,
      '../../../node_modules/react-native',
      :mac_catalyst_enabled => false
    )
    
    # Fix deployment targets
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '12.4'
      end
    end
  end
end
```

#### Android Fixes:
```gradle
// mobile-app/android/settings.gradle
rootProject.name = 'MindfulMeals'
apply from: file("../../../node_modules/@react-native-community/cli-platform-android/native_modules.gradle")
applyNativeModulesSettingsGradle(settings, "../../../")
include ':app'

// mobile-app/android/app/build.gradle
apply from: "../../../../node_modules/react-native/react.gradle"
```

## Phase 2: Metro Configuration Enhancement (Day 1)

### 2.1 Complete Metro Configuration
```javascript
// mobile-app/metro.config.js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');
const fs = require('fs');

// Find the workspace root
const workspaceRoot = path.resolve(__dirname, '../');
const projectRoot = __dirname;

// Create watchFolders including all workspace packages
const watchFolders = [
  workspaceRoot,
  // Include backend shared types if needed
  path.resolve(workspaceRoot, 'backend/shared'),
];

const config = {
  projectRoot,
  watchFolders,
  
  resolver: {
    // Ensure metro can resolve modules from workspace root
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(workspaceRoot, 'node_modules'),
    ],
    
    // Handle symlinks properly
    unstable_enableSymlinks: true,
    
    // Blocklist to avoid duplicate react-native
    blockList: [
      /\/backend\/.*/,
      /\/database\/.*/,
      /\/infrastructure\/.*/,
    ],
    
    // Extra node modules for monorepo
    extraNodeModules: {
      ...require('node-libs-react-native'),
    },
  },
  
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  
  // Reset cache on start
  resetCache: true,
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

## Phase 3: Fix Xcode Build Scripts (Day 1-2)

### 3.1 Create Xcode Build Phase Script
```bash
# mobile-app/ios/scripts/react-native-xcode.sh
#!/bin/bash
# This script wraps the react-native-xcode.sh to handle monorepo paths

export NODE_BINARY=$(command -v node)

# Set correct paths for monorepo
export REACT_NATIVE_PATH="../../../node_modules/react-native"

# Call the actual react-native-xcode.sh with correct paths
"$REACT_NATIVE_PATH/scripts/react-native-xcode.sh"
```

### 3.2 Update Xcode Build Phases
In Xcode:
1. Open "Build Phases" → "Bundle React Native code and images"
2. Replace the script with:
```bash
export NODE_BINARY=$(command -v node)
export REACT_NATIVE_DIR="../../../node_modules/react-native"

# Use our wrapper script
../scripts/react-native-xcode.sh
```

## Phase 4: Dependency Management (Day 2)

### 4.1 Root Package.json Overrides
```json
{
  "name": "mindfulmeals",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "mobile-app",
    "backend/*"
  ],
  "scripts": {
    "install:mobile": "npm install --workspace mobile-app",
    "install:backend": "npm install --workspace backend",
    "build:mobile:ios": "cd mobile-app && npm run ios",
    "build:mobile:android": "cd mobile-app && npm run android",
    "clean": "npm run clean --workspaces --if-present",
    "clean:all": "npm run clean && rm -rf node_modules package-lock.json && find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +",
    "postinstall": "npm run patch-packages"
  },
  "overrides": {
    "react-native-reanimated": "3.5.4",
    "@babel/plugin-transform-async-generator-functions": "7.24.6"
  },
  "devDependencies": {
    "patch-package": "^8.0.0"
  }
}
```

### 4.2 Mobile App Package.json Updates
```json
{
  "name": "@mindfulmeals/mobile-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start --reset-cache",
    "clean": "cd ios && rm -rf Pods build && cd ../android && ./gradlew clean && cd ..",
    "pod-install": "cd ios && pod install",
    "postinstall": "cd ios && pod install"
  },
  "dependencies": {
    // Keep existing dependencies but ensure versions are compatible
    "react-native-reanimated": "3.5.4"
  }
}
```

## Phase 5: Platform-Specific Fixes (Day 2)

### 5.1 iOS Specific Fixes

#### Create .xcode.env.local
```bash
# mobile-app/ios/.xcode.env.local
export NODE_BINARY=$(which node)
export NODE_OPTIONS="--max-old-space-size=8192"
```

#### Fix Flipper if needed
```javascript
// mobile-app/react-native.config.js
module.exports = {
  project: {
    ios: {},
    android: {},
  },
  dependencies: {
    // Disable Flipper if causing issues
    'react-native-flipper': {
      platforms: {
        ios: null,
      },
    },
  },
};
```

### 5.2 Android Specific Fixes

#### Update gradle.properties
```properties
# mobile-app/android/gradle.properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=4096m -XX:+HeapDumpOnOutOfMemoryError
org.gradle.daemon=true
org.gradle.parallel=true
org.gradle.configureondemand=true

# React Native Monorepo
reactNativeDir=../../../node_modules/react-native
```

## Phase 6: Automation Scripts (Day 2-3)

### 6.1 Create Setup Script
```bash
#!/bin/bash
# mobile-app/scripts/setup-monorepo.sh

echo "🚀 Setting up React Native Monorepo..."

# Function to find node binary
find_node() {
  if command -v node &> /dev/null; then
    echo $(command -v node)
  elif [ -f "$HOME/.nvm/versions/node/$(nvm current)/bin/node" ]; then
    echo "$HOME/.nvm/versions/node/$(nvm current)/bin/node"
  else
    echo "node"
  fi
}

# Set NODE_BINARY
export NODE_BINARY=$(find_node)
echo "Using Node: $NODE_BINARY"

# Clean everything
echo "🧹 Cleaning project..."
npm run clean:all

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# iOS Setup
if [[ "$OSTYPE" == "darwin"* ]]; then
  echo "🍎 Setting up iOS..."
  cd ios
  
  # Update .xcode.env
  echo "export NODE_BINARY=$NODE_BINARY" > .xcode.env.local
  
  # Install pods
  pod install --repo-update
  cd ..
fi

# Android Setup
echo "🤖 Setting up Android..."
cd android
./gradlew clean
cd ..

echo "✅ Setup complete!"
```

### 6.2 Create Build Scripts
```bash
#!/bin/bash
# mobile-app/scripts/build-ios.sh

# Ensure we're using the correct node
export NODE_BINARY=$(which node)

# Clean and build
cd ios
xcodebuild clean -workspace MindfulMeals.xcworkspace -scheme MindfulMeals
xcodebuild -workspace MindfulMeals.xcworkspace -scheme MindfulMeals -configuration Debug -sdk iphonesimulator -derivedDataPath build
```

## Phase 7: Testing and Validation (Day 3)

### 7.1 Create Test Script
```bash
#!/bin/bash
# scripts/test-monorepo-setup.sh

echo "🧪 Testing Monorepo Setup..."

# Test 1: Check node_modules resolution
echo "Test 1: Checking node_modules..."
if [ -d "../node_modules/react-native" ]; then
  echo "✅ React Native found in root node_modules"
else
  echo "❌ React Native not found in expected location"
fi

# Test 2: Metro bundler
echo "Test 2: Testing Metro bundler..."
npx react-native start --reset-cache &
METRO_PID=$!
sleep 10
if ps -p $METRO_PID > /dev/null; then
  echo "✅ Metro bundler started successfully"
  kill $METRO_PID
else
  echo "❌ Metro bundler failed to start"
fi

# Test 3: iOS build (if on macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
  echo "Test 3: iOS build test..."
  cd ios
  if xcodebuild -workspace MindfulMeals.xcworkspace -scheme MindfulMeals -destination 'platform=iOS Simulator,name=iPhone 14' -allowProvisioningUpdates build-for-testing; then
    echo "✅ iOS build successful"
  else
    echo "❌ iOS build failed"
  fi
  cd ..
fi
```

## Phase 8: Documentation (Day 3)

### 8.1 Create Monorepo Guide
```markdown
# mobile-app/MONOREPO_GUIDE.md

## Quick Start
1. Run setup: `./scripts/setup-monorepo.sh`
2. Start Metro: `npm start`
3. Run iOS: `npm run ios`
4. Run Android: `npm run android`

## Troubleshooting

### Module Resolution Issues
- Ensure you've run `npm install` from the workspace root
- Check that Metro is using the correct config
- Run with `--reset-cache` flag

### iOS Build Issues
- Check NODE_BINARY in .xcode.env.local
- Verify pod installation with `cd ios && pod install`
- Clean build folder: `cd ios && rm -rf build`

### Android Build Issues
- Clean gradle: `cd android && ./gradlew clean`
- Check gradle.properties for correct paths
```

## Implementation Timeline

### Day 1:
- [ ] Backup current setup
- [ ] Generate fresh native projects
- [ ] Apply monorepo path fixes
- [ ] Update Metro configuration

### Day 2:
- [ ] Fix Xcode build scripts
- [ ] Update dependency management
- [ ] Apply platform-specific fixes
- [ ] Create automation scripts

### Day 3:
- [ ] Run comprehensive tests
- [ ] Fix any remaining issues
- [ ] Document the setup
- [ ] Create troubleshooting guide

## Expected Outcomes

1. **No more manual fixes needed** - All paths and configurations properly set
2. **Reproducible builds** - Anyone can clone and build without issues
3. **Proper monorepo structure** - Leveraging npm workspaces correctly
4. **CI/CD ready** - Can be automated in pipelines
5. **Maintainable** - Easy to update and modify

## Key Differences from Local Fixes

1. **Permanent Xcode script fix** instead of manual path editing
2. **Proper Metro configuration** for monorepo instead of basic fixes
3. **Automated pod installation** with correct paths
4. **No manual node_modules manipulation**
5. **Boost and Flipper issues prevented** by proper configuration
6. **React Navigation compatibility** handled by dependency management

This plan provides a sustainable, maintainable solution that addresses all the issues you encountered while following React Native monorepo best practices.