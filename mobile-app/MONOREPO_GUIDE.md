# React Native Monorepo Guide

This guide explains how to work with the MindfulMeals React Native application in a monorepo setup.

## 🚀 Quick Start

### Initial Setup

```bash
# From the mobile-app directory
./scripts/setup-monorepo.sh
```

This script will:
- Clean all build artifacts
- Install dependencies at the workspace root
- Configure iOS (macOS only) and Android environments
- Set up proper Node.js paths

### Running the App

```bash
# Start Metro bundler
cd mobile-app && npm start

# In another terminal, run iOS (macOS only)
cd mobile-app && npm run ios

# Or run Android
cd mobile-app && npm run android
```

## 📁 Monorepo Structure

```
workspace/
├── node_modules/           # Shared dependencies (hoisted)
├── package.json           # Root package.json with workspaces
├── mobile-app/
│   ├── src/              # React Native source code
│   ├── ios/              # iOS native code
│   ├── android/          # Android native code
│   ├── metro.config.js   # Metro bundler config
│   ├── package.json      # Mobile app dependencies
│   └── scripts/          # Automation scripts
└── backend/              # Backend services (if applicable)
```

## 🔧 Key Configuration Files

### 1. Metro Configuration (`mobile-app/metro.config.js`)
- Configured to watch the workspace root
- Resolves modules from both local and root `node_modules`
- Blocks backend paths to prevent bundling server code

### 2. iOS Configuration
- **Podfile**: Uses paths relative to workspace root (`../../../node_modules`)
- **.xcode.env.local**: Sets NODE_BINARY for Xcode builds
- **Build Scripts**: Custom wrapper for react-native-xcode.sh

### 3. Android Configuration
- **settings.gradle**: Points to workspace root for React Native
- **app/build.gradle**: Configured with monorepo paths
- **gradle.properties**: Sets `reactNativeDir` for monorepo

## 🛠️ Common Tasks

### Installing Dependencies

```bash
# Install all workspace dependencies
npm install

# Install only mobile app dependencies
npm install --workspace mobile-app

# Install a new dependency for mobile app
npm install <package-name> --workspace mobile-app
```

### Cleaning the Project

```bash
# Clean everything (nuclear option)
npm run clean:all

# Clean just mobile app
cd mobile-app && npm run clean

# Clean iOS
cd mobile-app/ios && rm -rf Pods build && pod install

# Clean Android
cd mobile-app/android && ./gradlew clean
```

### Building for Release

#### iOS (macOS only)
```bash
cd mobile-app
./scripts/build-ios.sh --release
```

#### Android
```bash
cd mobile-app/android
./gradlew assembleRelease
```

## 🐛 Troubleshooting

### Module Resolution Issues

**Problem**: "Module not found" errors
```bash
# Solution 1: Clear Metro cache
cd mobile-app && npm start -- --reset-cache

# Solution 2: Reinstall dependencies
npm run clean:all && npm install
```

### iOS Build Issues

**Problem**: "node: command not found" in Xcode
```bash
# Solution: Update .xcode.env.local
cd mobile-app/ios
echo "export NODE_BINARY=$(which node)" > .xcode.env.local
```

**Problem**: Pod installation fails
```bash
# Solution: Clean and reinstall
cd mobile-app/ios
rm -rf Pods Podfile.lock
pod install --repo-update
```

### Android Build Issues

**Problem**: "React Native not found"
```bash
# Solution: Check gradle.properties
# Ensure this line exists:
# reactNativeDir=../../../node_modules/react-native
```

**Problem**: Gradle build fails
```bash
# Solution: Clean and rebuild
cd mobile-app/android
./gradlew clean
./gradlew --stop  # Stop gradle daemon
./gradlew assembleDebug
```

### Metro Bundler Issues

**Problem**: Metro can't find modules
```bash
# Solution: Check metro.config.js watchFolders
# Should include workspace root:
# watchFolders: [workspaceRoot]
```

## 📊 Testing the Setup

Run the test script to verify everything is configured correctly:

```bash
cd mobile-app
./scripts/test-monorepo-setup.sh
```

This will check:
- Workspace structure
- React Native installation
- Metro configuration
- iOS setup (macOS only)
- Android setup
- Package naming
- Build commands

## 🔄 Updating React Native

When updating React Native version:

1. Update version in `mobile-app/package.json`
2. Update `@react-native/metro-config` to match
3. Clean everything: `npm run clean:all`
4. Reinstall: `npm install`
5. For iOS: `cd mobile-app/ios && pod update`
6. Run tests: `./scripts/test-monorepo-setup.sh`

## 📝 Best Practices

1. **Always use workspace commands** when installing packages
2. **Run Metro with --reset-cache** after configuration changes
3. **Keep native project files in sync** with JavaScript dependencies
4. **Use the provided scripts** instead of manual commands
5. **Commit .xcode.env but not .xcode.env.local**

## 🚨 Important Notes

- The iOS project name must match the app name in `app.json`
- Android package name is set to `com.mindfulmeals`
- All React Native dependencies are hoisted to the workspace root
- The monorepo uses npm workspaces (not Yarn or Lerna)

## 🤝 Contributing

When contributing to this project:

1. Run the test suite before committing
2. Update this documentation if you change the setup
3. Test both iOS and Android builds
4. Ensure Metro bundler starts without errors

## 📞 Getting Help

If you encounter issues not covered in this guide:

1. Check the test output: `./scripts/test-monorepo-setup.sh`
2. Look at Metro logs: `npm start -- --verbose`
3. Check native build logs in Xcode or Android Studio
4. Review the [React Native Monorepo documentation](https://github.com/react-native-community/cli/blob/main/docs/projects.md)