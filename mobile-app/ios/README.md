# iOS Setup Guide - MindfulMeals

## Prerequisites

- macOS (required for iOS development)
- Xcode 14.0 or later
- CocoaPods (`sudo gem install cocoapods`)
- Node.js 16 or later

## Setup Instructions

### 1. Install Dependencies

```bash
# From the mobile-app directory
npm install

# Navigate to iOS directory
cd ios

# Install CocoaPods dependencies
pod install
```

### 2. Configure Lottie Animations

The project is pre-configured for Lottie animations. The configuration is in:
- `react-native.config.js` - Lottie iOS source directory
- `Podfile` - CocoaPods configuration

### 3. Permissions

The following permissions are configured in Info.plist:
- **Camera**: For future barcode scanning features
- **Photo Library**: For saving meal images
- **Haptic Feedback**: For mindful moment vibrations

### 4. Build Configuration

- **Hermes**: Enabled by default for better performance
- **Minimum iOS Version**: 12.0
- **Swift Version**: Latest stable

### 5. Running the App

#### From Xcode:
1. Open `MindfulMeals.xcworkspace` (not .xcodeproj)
2. Select your target device/simulator
3. Press Cmd+R to build and run

#### From Terminal:
```bash
# From mobile-app directory
npx react-native run-ios

# Or specify a simulator
npx react-native run-ios --simulator="iPhone 14 Pro"
```

## Troubleshooting

### Pod Installation Issues

If you encounter pod installation errors:

```bash
# Clean pods
cd ios
pod deintegrate
pod cache clean --all

# Reinstall
pod install
```

### Build Errors

1. **Clean Build Folder**: In Xcode, Product → Clean Build Folder (Cmd+Shift+K)
2. **Clear Metro Cache**: `npx react-native start --reset-cache`
3. **Reset Package Manager Cache**: `npm start -- --reset-cache`

### Lottie Animation Issues

If Lottie animations don't work:
1. Ensure `lottie-ios` is properly linked in Pods
2. Clean and rebuild the project
3. Check that animation files are in the correct format (JSON)

### Vector Icons Issues

If icons don't display:
1. Run `npx react-native-asset` to link font files
2. Ensure fonts are copied to iOS bundle
3. Clean and rebuild

## Performance Optimization

- Hermes is enabled for improved startup time and memory usage
- Use React DevTools to profile performance
- Enable release mode for testing: `npx react-native run-ios --configuration Release`

## Mindfulness Features Configuration

Special iOS configurations for our mindfulness features:

1. **Haptic Feedback**: CoreHaptics framework is automatically included
2. **Background Audio**: For meditation/breathing exercises (configure in Info.plist if needed)
3. **HealthKit**: For future wellness tracking integration (not yet implemented)

## Next Steps

After successful iOS setup:
1. Test on multiple iOS versions (12.0+)
2. Verify all animations work smoothly
3. Test haptic feedback on physical devices
4. Ensure proper keyboard handling for forms