# iOS Setup Troubleshooting Guide

## Common Issues and Solutions

### 🔴 Issue: "Could not automatically select an Xcode project"

**Error Message:**
```
[!] Could not automatically select an Xcode project. Specify one in your Podfile like so:
    project 'path/to/Project.xcodeproj'
```

**Solution:**
This error occurs when the Xcode project file is missing. Run the fix script:

```bash
cd mobile-app/ios
./fix-pod-issue.sh
```

This script will:
1. Create the missing Xcode project file
2. Configure it correctly for MindfulMeals
3. Clean and reinstall CocoaPods

### 🔴 Issue: Missing Xcode Project Files

**Symptoms:**
- No `.xcodeproj` file in the `ios` directory
- Cannot open project in Xcode
- Pod install fails

**Solution:**
The iOS project wasn't properly initialized. The updated `setup-ios.sh` script now handles this automatically. To fix manually:

```bash
cd mobile-app
npx react-native@0.72.6 init TempProject --version 0.72.6
cp -r TempProject/ios/*.xcodeproj ios/
cd ios/MindfulMeals.xcodeproj
# Rename all references from TempProject to MindfulMeals
rm -rf ../../TempProject
```

### 🔴 Issue: Pod Install Hanging

**Symptoms:**
- `pod install` takes forever
- Stuck at "Analyzing dependencies"

**Solution:**
1. Clear CocoaPods cache:
   ```bash
   pod cache clean --all
   rm -rf ~/Library/Caches/CocoaPods
   ```

2. Update repo and retry:
   ```bash
   pod repo update
   pod install --verbose
   ```

3. Use CDN instead of git:
   ```bash
   # Add to top of Podfile:
   source 'https://cdn.cocoapods.org/'
   ```

### 🔴 Issue: React Native Version Mismatch

**Error:**
```
error React Native version mismatch.
JavaScript version: 0.72.6
Native version: 0.71.x
```

**Solution:**
1. Ensure package.json has correct version:
   ```json
   "react-native": "0.72.6"
   ```

2. Clean and reinstall:
   ```bash
   cd mobile-app
   rm -rf node_modules
   npm install
   cd ios
   pod deintegrate
   pod install
   ```

### 🔴 Issue: Build Fails in Xcode

**Common Causes:**
1. **Signing issues**: Select your development team in Xcode
2. **Missing dependencies**: Run `pod install`
3. **Clean build needed**: Cmd+Shift+K in Xcode

**Solution Steps:**
1. Clean build folder: Product → Clean Build Folder
2. Delete DerivedData:
   ```bash
   rm -rf ~/Library/Developer/Xcode/DerivedData
   ```
3. Reset packages:
   ```bash
   cd ios
   pod deintegrate
   rm -rf Pods Podfile.lock
   pod install
   ```

### 🔴 Issue: Metro Bundler Connection Failed

**Error:**
```
No bundle URL present
```

**Solution:**
1. Kill all Metro processes:
   ```bash
   killall -9 node
   ```

2. Clear Metro cache:
   ```bash
   rm -rf $TMPDIR/metro-*
   rm -rf $TMPDIR/react-*
   ```

3. Start Metro manually:
   ```bash
   cd mobile-app
   npm start -- --reset-cache
   ```

4. In another terminal:
   ```bash
   npm run ios
   ```

### 🔴 Issue: Simulator Not Found

**Error:**
```
Could not find "iPhone 15 Pro" simulator
```

**Solution:**
1. List available simulators:
   ```bash
   xcrun simctl list devices available
   ```

2. Create missing simulator:
   ```bash
   # In Xcode: Window → Devices and Simulators → Add
   ```

3. Use available simulator:
   ```bash
   npm run ios -- --simulator="iPhone 14"
   ```

## Quick Fixes Checklist

If iOS setup is failing, try these steps in order:

1. **Run the fix script:**
   ```bash
   cd mobile-app/ios
   ./fix-pod-issue.sh
   ```

2. **Clean everything:**
   ```bash
   cd mobile-app
   ./setup.sh
   # Choose option 5 (Clean Installation)
   # Then run iOS setup again
   ```

3. **Manual reset:**
   ```bash
   cd mobile-app
   rm -rf node_modules ios/Pods ios/Podfile.lock
   npm install
   cd ios
   pod install
   ```

4. **Nuclear option:**
   ```bash
   cd mobile-app
   rm -rf ios
   npx react-native@0.72.6 init MindfulMeals --version 0.72.6
   # Copy only the iOS folder from the new project
   ```

## Getting Help

If none of these solutions work:

1. Check the full error log
2. Run with verbose output: `pod install --verbose`
3. Check Xcode console for detailed errors
4. Verify all prerequisites are correctly installed

Remember: Most iOS setup issues are related to:
- Missing Xcode project files
- CocoaPods cache/repo issues
- Version mismatches
- Signing/certificate problems