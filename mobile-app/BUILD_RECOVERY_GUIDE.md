# MindfulMeals Build Recovery Guide

## 🚀 Best Workflow to Initialize React Native Build

This guide provides the optimal workflow to get your React Native app building without errors.

## Quick Start (Recommended)

Run the automated fix script:

```bash
cd mobile-app/scripts
./fix-build-issues.sh
```

This will handle 90% of common build issues automatically.

## Manual Step-by-Step Workflow

### Step 1: Pre-flight Checks

```bash
# Verify Node version (should be 18+)
node --version

# Verify npm version (should be 8+)
npm --version

# Verify Java (for Android)
java --version

# Verify Android SDK
echo $ANDROID_HOME

# Verify Xcode (for iOS/macOS only)
xcode-select -p
```

### Step 2: Nuclear Clean (Start Fresh)

```bash
cd mobile-app

# Clean EVERYTHING
rm -rf node_modules
rm -rf package-lock.json
rm -rf ios/Pods
rm -rf ios/build
rm -rf ios/Podfile.lock
rm -rf android/.gradle
rm -rf android/app/build
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*

# Clean Xcode DerivedData (macOS)
rm -rf ~/Library/Developer/Xcode/DerivedData

# Kill any hanging processes
pkill -f node || true
pkill -f "react-native" || true
killall -9 watchman || true
```

### Step 3: Fix Dependencies

```bash
# Use the dependency doctor
./scripts/dependency-doctor.sh

# OR manually:
npm install --legacy-peer-deps
```

### Step 4: Platform-Specific Setup

#### iOS (macOS only):
```bash
cd ios

# Update pods repo (first time or if having issues)
pod repo update

# Install pods
pod install

# If pod install fails:
pod deintegrate
rm -rf Pods Podfile.lock
pod install --repo-update

cd ..
```

#### Android:
```bash
cd android

# Create local.properties if missing
echo "sdk.dir=$ANDROID_HOME" > local.properties

# Clean gradle
./gradlew clean

# Download dependencies
./gradlew dependencies

cd ..
```

### Step 5: Start Metro Bundler

```bash
# Start Metro in a separate terminal
npm start -- --reset-cache

# OR use the quick fix script
./scripts/quick-fix-metro.sh
```

### Step 6: Run the App

```bash
# iOS (macOS only)
npm run ios

# Android
npm run android

# Specific device/simulator
npm run ios -- --simulator="iPhone 14"
npm run android -- --deviceId="emulator-5554"
```

## Common Issues & Quick Fixes

### 1. Metro Bundler Issues
```bash
./scripts/quick-fix-metro.sh
```

### 2. Dependency Conflicts
```bash
./scripts/dependency-doctor.sh
```

### 3. iOS Build Failures
```bash
cd ios
pod deintegrate && pod install
cd ..
```

### 4. Android Build Failures
```bash
cd android
./gradlew clean
cd ..
```

### 5. "Module not found" Errors
```bash
# Clear all caches and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### 6. Type Definition Conflicts
```bash
# Add to package.json
"resolutions": {
  "@types/react": "^18.0.24"
}
```

## Build Workflow Best Practices

### Daily Development Workflow

1. **Start your day clean:**
   ```bash
   npm start -- --reset-cache
   ```

2. **After pulling changes:**
   ```bash
   npm install
   cd ios && pod install && cd ..  # macOS only
   ```

3. **When switching branches:**
   ```bash
   ./scripts/quick-fix-metro.sh
   ```

### Weekly Maintenance

Run the full clean build:
```bash
./scripts/fix-build-issues.sh
```

### Before Major Updates

1. Create a backup branch
2. Run dependency doctor
3. Update dependencies gradually
4. Test on both platforms

## Environment Setup Checklist

- [ ] Node.js 18+ installed
- [ ] npm 8+ installed  
- [ ] React Native CLI installed globally
- [ ] Android Studio + SDK (for Android)
- [ ] Xcode 14+ (for iOS)
- [ ] Environment variables set:
  - [ ] `ANDROID_HOME`
  - [ ] `JAVA_HOME`
  - [ ] PATH includes Android tools

## Emergency Recovery

If nothing else works:

```bash
# The nuclear option
cd mobile-app
rm -rf ios android

# Reinitialize native folders
npx react-native@0.72.6 init TempApp --version 0.72.6
cp -r TempApp/ios .
cp -r TempApp/android .
rm -rf TempApp

# Apply your app-specific changes
# Update bundle IDs, app names, etc.
```

## Preventing Future Issues

1. **Use exact versions** in package.json (no ^)
2. **Commit package-lock.json**
3. **Document native changes**
4. **Run CI/CD checks**
5. **Keep dependencies updated** gradually

## Need Help?

If builds still fail after following this guide:

1. Check error logs in:
   - iOS: `ios/build/Logs/`
   - Android: `android/app/build/outputs/`

2. Run with verbose logging:
   ```bash
   npm run ios -- --verbose
   npm run android -- --verbose
   ```

3. Search for specific error messages in:
   - React Native GitHub issues
   - Stack Overflow
   - Package-specific repositories

Remember: Most React Native build issues are caused by:
- Cache inconsistencies (70%)
- Dependency conflicts (20%)
- Native configuration issues (10%)