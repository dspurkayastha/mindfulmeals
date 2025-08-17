#!/bin/bash

# MindfulMeals React Native Build Fix Script
# This script fixes common build issues and initializes the project correctly

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔧 MindfulMeals Build Fix Script${NC}"
echo -e "${GREEN}================================${NC}"

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR/.."

cd "$PROJECT_ROOT"

# Step 1: Clean everything
echo -e "\n${YELLOW}Step 1: Cleaning all build artifacts...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Clean node modules
echo "🗑️  Removing node_modules..."
rm -rf node_modules
rm -rf package-lock.json

# Clean iOS
echo "🗑️  Cleaning iOS build artifacts..."
if [ -d "ios" ]; then
    cd ios
    rm -rf Pods
    rm -rf build
    rm -rf ~/Library/Developer/Xcode/DerivedData
    rm -f Podfile.lock
    cd ..
fi

# Clean Android
echo "🗑️  Cleaning Android build artifacts..."
if [ -d "android" ]; then
    cd android
    ./gradlew clean || true
    rm -rf .gradle
    rm -rf app/build
    cd ..
fi

# Clean Metro cache
echo "🗑️  Cleaning Metro bundler cache..."
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*

# Clean watchman
echo "🗑️  Cleaning Watchman cache..."
watchman watch-del-all 2>/dev/null || true

# Step 2: Fix package.json dependencies
echo -e "\n${YELLOW}Step 2: Fixing package dependencies...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Create a fixed package.json with resolved versions
cat > package.json.fixed << 'EOF'
{
  "name": "@mindfulmeals/mobile-app",
  "version": "1.0.0",
  "description": "MindfulMeals - Nourish your body, mind, and soul",
  "private": true,
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start --reset-cache",
    "test": "jest",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "clean": "cd ios && rm -rf Pods build && cd ../android && ./gradlew clean && cd ..",
    "pod-install": "cd ios && pod install",
    "postinstall": "patch-package"
  },
  "dependencies": {
    "@react-native-async-storage/async-storage": "^1.19.5",
    "@react-native-community/blur": "^4.3.2",
    "@react-native-voice/voice": "^3.2.4",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/native-stack": "^6.9.17",
    "@react-navigation/stack": "^6.3.20",
    "@tanstack/react-query": "^5.17.9",
    "axios": "^1.6.5",
    "date-fns": "^3.2.0",
    "i18next": "^23.7.16",
    "lottie-react-native": "^6.5.1",
    "moti": "^0.27.2",
    "react": "18.2.0",
    "react-i18next": "^14.0.0",
    "react-native": "0.72.6",
    "react-native-background-timer": "^2.4.1",
    "react-native-calendars": "^1.1304.0",
    "react-native-chart-kit": "^6.12.0",
    "react-native-gesture-handler": "~2.12.0",
    "react-native-haptic-feedback": "^2.2.0",
    "react-native-linear-gradient": "^2.8.3",
    "react-native-paper": "^5.11.4",
    "react-native-push-notification": "^8.1.1",
    "react-native-reanimated": "~3.3.0",
    "react-native-safe-area-context": "^4.6.3",
    "react-native-screens": "~3.22.0",
    "react-native-share": "^10.0.2",
    "react-native-svg": "^13.9.0",
    "react-native-toast-message": "^2.1.7",
    "react-native-vector-icons": "^10.0.3",
    "patch-package": "^8.0.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@babel/preset-env": "^7.20.0",
    "@babel/runtime": "^7.20.0",
    "@react-native/eslint-config": "^0.72.2",
    "@react-native/metro-config": "^0.72.11",
    "@tsconfig/react-native": "^3.0.0",
    "@types/jest": "^29.2.1",
    "@types/react": "^18.0.24",
    "@types/react-test-renderer": "^18.0.0",
    "babel-jest": "^29.2.1",
    "eslint": "^8.19.0",
    "jest": "^29.2.1",
    "metro-react-native-babel-preset": "0.76.8",
    "prettier": "^2.4.1",
    "react-test-renderer": "18.2.0",
    "typescript": "5.0.4"
  },
  "jest": {
    "preset": "react-native"
  },
  "resolutions": {
    "@types/react": "^18.0.24"
  }
}
EOF

# Backup original and use fixed version
mv package.json package.json.backup
mv package.json.fixed package.json

# Step 3: Install dependencies
echo -e "\n${YELLOW}Step 3: Installing dependencies...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

npm install --legacy-peer-deps

# Step 4: Apply patches if any exist
# Note: Patches should be created using 'npx patch-package <package-name>' after manually
# fixing issues in node_modules. Do not create fake patches with invalid git hashes.
echo -e "\n${YELLOW}Step 4: Checking for patches...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Create patches directory if it doesn't exist
mkdir -p patches

# Apply any existing patches
if [ "$(ls -A patches 2>/dev/null)" ]; then
    echo -e "${GREEN}Applying existing patches...${NC}"
    npx patch-package
else
    echo -e "${YELLOW}No patches to apply${NC}"
fi

# Step 5: Setup iOS
echo -e "\n${YELLOW}Step 5: Setting up iOS...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [[ "$OSTYPE" == "darwin"* ]]; then
    cd ios
    
    # The Podfile is now dynamic and doesn't need to be recreated
    echo "📱 Using dynamic Podfile configuration..."
    
    # Set environment variables for pod install
    export NO_FLIPPER=1  # Disable Flipper by default for faster builds
    export IOS_DEPLOYMENT_TARGET=12.4
    
    # Clean pod cache
    echo "🧹 Cleaning CocoaPods cache..."
    pod cache clean --all
    
    # Install pods with verbose output
    echo "📦 Installing CocoaPods dependencies..."
    pod install --repo-update --verbose
    
    cd ..
else
    echo "⚠️  Skipping iOS setup (not on macOS)"
fi

# Step 6: Setup Android
echo -e "\n${YELLOW}Step 6: Setting up Android...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cd android

# Create local.properties if it doesn't exist
if [ ! -f local.properties ]; then
    if [ -n "$ANDROID_HOME" ]; then
        echo "sdk.dir=$ANDROID_HOME" > local.properties
    else
        echo "⚠️  ANDROID_HOME not set. Please set it manually in android/local.properties"
    fi
fi

# Update gradle.properties for better build performance
cat >> gradle.properties << 'EOF'

# Improve build performance
org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=1024m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8
org.gradle.parallel=true
org.gradle.configureondemand=true
org.gradle.daemon=true

# React Native
hermesEnabled=true
EOF

cd ..

# Step 7: Create Metro config with fixes
echo -e "\n${YELLOW}Step 7: Configuring Metro bundler...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cat > metro.config.js << 'EOF'
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json'],
  },
};

module.exports = mergeConfig(defaultConfig, config);
EOF

# Step 8: Final verification
echo -e "\n${YELLOW}Step 8: Verifying setup...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Check if all required files exist
if [ -f "node_modules/react-native/package.json" ]; then
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Dependencies installation failed${NC}"
    exit 1
fi

if [[ "$OSTYPE" == "darwin"* ]] && [ -d "ios/Pods" ]; then
    echo -e "${GREEN}✅ iOS Pods installed successfully${NC}"
fi

if [ -f "android/local.properties" ]; then
    echo -e "${GREEN}✅ Android configuration found${NC}"
else
    echo -e "${YELLOW}⚠️  Android local.properties missing - please configure manually${NC}"
fi

echo -e "\n${GREEN}✅ Build fix completed!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Start Metro bundler: npm start"
echo "2. Run on iOS: npm run ios"
echo "3. Run on Android: npm run android"
echo -e "\n${YELLOW}If you still encounter issues:${NC}"
echo "- For iOS: cd ios && pod deintegrate && pod install"
echo "- For Android: cd android && ./gradlew clean"
echo "- Check logs in: ios/build/Logs/ or android/app/build/outputs/"