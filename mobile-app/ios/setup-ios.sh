#!/bin/bash

# iOS Setup Script for MindfulMeals
# This script documents the iOS setup process for developers

echo "📱 iOS Setup for MindfulMeals"
echo "============================"

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "⚠️  Warning: iOS development requires macOS"
    exit 1
fi

# Check for CocoaPods
if ! command -v pod &> /dev/null; then
    echo "❌ CocoaPods not found. Installing..."
    sudo gem install cocoapods
fi

# Check for Xcode
if ! command -v xcodebuild &> /dev/null; then
    echo "❌ Xcode not found. Please install Xcode from the Mac App Store"
    exit 1
fi

echo "✅ Prerequisites checked"

# Navigate to iOS directory
cd "$(dirname "$0")"

# Update Podfile for Lottie configuration
echo "🔧 Configuring Podfile for Lottie and Reanimated..."

# Install pods
echo "📦 Installing CocoaPods dependencies..."
pod install

# Configure Lottie for iOS
echo "🎨 Configuring Lottie..."
cat > ../react-native.config.js << 'EOF'
module.exports = {
  dependencies: {
    'lottie-react-native': {
      platforms: {
        ios: {
          sourceDir: './node_modules/lottie-react-native/src/ios',
        },
      },
    },
    'react-native-vector-icons': {
      platforms: {
        ios: null,
      },
    },
  },
};
EOF

# Additional iOS configurations
echo "⚙️  Additional iOS configurations..."

# Enable Hermes for performance
sed -i '' 's/:hermes_enabled => flags\[:hermes_enabled\]/:hermes_enabled => true/' Podfile

# Configure Info.plist for permissions
echo "📝 Configuring Info.plist permissions..."
PLIST_FILE="MindfulMeals/Info.plist"

# Add camera permission for future barcode scanning
/usr/libexec/PlistBuddy -c "Add :NSCameraUsageDescription string 'MindfulMeals needs camera access to scan food barcodes'" "$PLIST_FILE" 2>/dev/null || \
/usr/libexec/PlistBuddy -c "Set :NSCameraUsageDescription 'MindfulMeals needs camera access to scan food barcodes'" "$PLIST_FILE"

# Add photo library permission
/usr/libexec/PlistBuddy -c "Add :NSPhotoLibraryUsageDescription string 'MindfulMeals needs photo access to save meal images'" "$PLIST_FILE" 2>/dev/null || \
/usr/libexec/PlistBuddy -c "Set :NSPhotoLibraryUsageDescription 'MindfulMeals needs photo access to save meal images'" "$PLIST_FILE"

# Add haptic feedback permission message
/usr/libexec/PlistBuddy -c "Add :NSHapticUsageDescription string 'MindfulMeals uses haptic feedback for mindful moments'" "$PLIST_FILE" 2>/dev/null || \
/usr/libexec/PlistBuddy -c "Set :NSHapticUsageDescription 'MindfulMeals uses haptic feedback for mindful moments'" "$PLIST_FILE"

# Clean and reinstall pods
echo "🧹 Cleaning and reinstalling pods..."
pod deintegrate
pod install

echo "✅ iOS setup complete!"
echo ""
echo "Next steps:"
echo "1. Open MindfulMeals.xcworkspace in Xcode"
echo "2. Select a simulator or device"
echo "3. Build and run the project (Cmd+R)"
echo ""
echo "To run from command line:"
echo "npx react-native run-ios"