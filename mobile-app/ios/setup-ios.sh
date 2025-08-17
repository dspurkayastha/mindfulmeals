#!/bin/bash

# iOS Setup Script for MindfulMeals
# This script automates the iOS setup process for developers

echo "📱 iOS Setup for MindfulMeals"
echo "============================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print colored output
print_status() {
    case $1 in
        "success") echo -e "${GREEN}✅ $2${NC}" ;;
        "error") echo -e "${RED}❌ $2${NC}" ;;
        "warning") echo -e "${YELLOW}⚠️  $2${NC}" ;;
        "info") echo -e "${BLUE}ℹ️  $2${NC}" ;;
    esac
}

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    print_status "error" "iOS development requires macOS"
    print_status "info" "For Android development, run: ./android/setup-android.sh"
    exit 1
fi

print_status "success" "Running on macOS"

# Check for Xcode
if ! command_exists xcodebuild; then
    print_status "error" "Xcode not found. Please install Xcode from the Mac App Store"
    print_status "info" "After installing, run: sudo xcode-select --switch /Applications/Xcode.app"
    exit 1
else
    XCODE_VERSION=$(xcodebuild -version | head -n 1 | awk '{print $2}')
    print_status "success" "Xcode $XCODE_VERSION found"
fi

# Check Xcode Command Line Tools
if ! xcode-select -p &> /dev/null; then
    print_status "warning" "Xcode Command Line Tools not found. Installing..."
    xcode-select --install
    print_status "info" "Please complete the installation and run this script again"
    exit 1
fi

# Accept Xcode license if needed
if ! xcodebuild -license check &> /dev/null; then
    print_status "warning" "Xcode license not accepted"
    sudo xcodebuild -license accept
fi

# Check for Node.js
if ! command_exists node; then
    print_status "error" "Node.js not found. Please install Node.js (v18+)"
    print_status "info" "Install via Homebrew: brew install node"
    exit 1
else
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_status "warning" "Node.js version is less than 18. Please update for best compatibility"
    else
        print_status "success" "Node.js $(node -v) found"
    fi
fi

# Check for Homebrew
if ! command_exists brew; then
    print_status "warning" "Homebrew not found. Installing..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Check for Ruby (required for CocoaPods)
if ! command_exists ruby; then
    print_status "error" "Ruby not found"
    exit 1
else
    RUBY_VERSION=$(ruby -v | awk '{print $2}' | cut -d'p' -f1)
    print_status "success" "Ruby $RUBY_VERSION found"
fi

# Check for CocoaPods
if ! command_exists pod; then
    print_status "warning" "CocoaPods not found. Installing..."
    sudo gem install cocoapods
    
    # Alternative installation method if gem fails
    if ! command_exists pod; then
        print_status "info" "Trying Homebrew installation..."
        brew install cocoapods
    fi
fi

if command_exists pod; then
    POD_VERSION=$(pod --version)
    print_status "success" "CocoaPods $POD_VERSION installed"
else
    print_status "error" "Failed to install CocoaPods"
    exit 1
fi

# Navigate to project root
cd "$PROJECT_ROOT"

# Install npm dependencies if not already installed
if [ ! -d "node_modules" ]; then
    print_status "info" "Installing npm dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        print_status "error" "Failed to install npm dependencies"
        exit 1
    fi
    print_status "success" "npm dependencies installed"
else
    print_status "success" "npm dependencies already installed"
fi

# Navigate to iOS directory
cd "$SCRIPT_DIR"

# Update Podfile for optimizations and fixes
print_status "info" "Configuring Podfile..."

# Backup original Podfile
cp Podfile Podfile.backup 2>/dev/null || true

# Ensure Hermes is enabled and configure other settings
if grep -q "hermes_enabled" Podfile; then
    # Update existing Hermes configuration
    sed -i '' 's/:hermes_enabled => .*/:hermes_enabled => true,/' Podfile
else
    # Add Hermes configuration if not present
    sed -i '' '/use_react_native/ s/$/\n    :hermes_enabled => true,/' Podfile
fi

# Add Flipper configuration for debugging (optional)
if ! grep -q "use_flipper" Podfile; then
    cat >> Podfile << 'EOF'

# Enable Flipper for debugging (optional, comment out for production)
# use_flipper!()
EOF
fi

# Clean previous pod installations
print_status "info" "Cleaning previous CocoaPods installation..."
pod deintegrate &>/dev/null || true
rm -rf Pods Podfile.lock &>/dev/null || true

# Install pods with repo update
print_status "info" "Installing CocoaPods dependencies (this may take a while)..."
pod install --repo-update

if [ $? -ne 0 ]; then
    print_status "error" "Pod installation failed"
    print_status "info" "Trying without repo update..."
    pod install
fi

# Configure Info.plist for permissions
print_status "info" "Configuring Info.plist permissions..."
PLIST_FILE="MindfulMeals/Info.plist"

if [ -f "$PLIST_FILE" ]; then
    # Camera permission for barcode scanning
    /usr/libexec/PlistBuddy -c "Add :NSCameraUsageDescription string 'MindfulMeals needs camera access to scan food barcodes for easy nutrition tracking'" "$PLIST_FILE" 2>/dev/null || \
    /usr/libexec/PlistBuddy -c "Set :NSCameraUsageDescription 'MindfulMeals needs camera access to scan food barcodes for easy nutrition tracking'" "$PLIST_FILE"

    # Photo library permission
    /usr/libexec/PlistBuddy -c "Add :NSPhotoLibraryUsageDescription string 'MindfulMeals needs photo access to save and share your meal images'" "$PLIST_FILE" 2>/dev/null || \
    /usr/libexec/PlistBuddy -c "Set :NSPhotoLibraryUsageDescription 'MindfulMeals needs photo access to save and share your meal images'" "$PLIST_FILE"

    # Microphone permission for voice features
    /usr/libexec/PlistBuddy -c "Add :NSMicrophoneUsageDescription string 'MindfulMeals uses your microphone for voice-guided mindfulness exercises'" "$PLIST_FILE" 2>/dev/null || \
    /usr/libexec/PlistBuddy -c "Set :NSMicrophoneUsageDescription 'MindfulMeals uses your microphone for voice-guided mindfulness exercises'" "$PLIST_FILE"

    # Motion permission for activity tracking
    /usr/libexec/PlistBuddy -c "Add :NSMotionUsageDescription string 'MindfulMeals tracks your activity to provide personalized nutrition recommendations'" "$PLIST_FILE" 2>/dev/null || \
    /usr/libexec/PlistBuddy -c "Set :NSMotionUsageDescription 'MindfulMeals tracks your activity to provide personalized nutrition recommendations'" "$PLIST_FILE"

    # App Transport Security for development
    /usr/libexec/PlistBuddy -c "Add :NSAppTransportSecurity:NSAllowsArbitraryLoads bool true" "$PLIST_FILE" 2>/dev/null || \
    /usr/libexec/PlistBuddy -c "Set :NSAppTransportSecurity:NSAllowsArbitraryLoads true" "$PLIST_FILE"

    print_status "success" "Info.plist permissions configured"
else
    print_status "warning" "Info.plist not found. Permissions will need to be configured manually"
fi

# Configure app capabilities
print_status "info" "Configuring app capabilities..."

# Create entitlements file if it doesn't exist
ENTITLEMENTS_FILE="MindfulMeals/MindfulMeals.entitlements"
if [ ! -f "$ENTITLEMENTS_FILE" ]; then
    cat > "$ENTITLEMENTS_FILE" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <!-- Push Notifications -->
    <key>aps-environment</key>
    <string>development</string>
    
    <!-- App Groups for sharing data -->
    <key>com.apple.security.application-groups</key>
    <array>
        <string>group.com.mindfulmeals</string>
    </array>
    
    <!-- HealthKit -->
    <key>com.apple.developer.healthkit</key>
    <true/>
    <key>com.apple.developer.healthkit.access</key>
    <array>
        <string>health-records</string>
    </array>
</dict>
</plist>
EOF
    print_status "success" "Created entitlements file"
fi

# Install additional iOS dependencies
print_status "info" "Installing additional iOS tools..."

# Install ios-deploy for device deployment
if ! command_exists ios-deploy; then
    npm install -g ios-deploy --unsafe-perm=true
fi

# Install xcpretty for better build output
if ! command_exists xcpretty; then
    gem install xcpretty
fi

# Final setup steps
print_status "info" "Running final setup steps..."

# Open Xcode workspace
print_status "success" "iOS setup complete!"
echo ""
echo "📱 Next steps:"
echo "1. Open the project in Xcode:"
echo "   open MindfulMeals.xcworkspace"
echo ""
echo "2. Select your development team:"
echo "   - Click on the project name in Xcode"
echo "   - Go to 'Signing & Capabilities' tab"
echo "   - Select your Apple Developer team"
echo ""
echo "3. Run the app:"
echo "   - Select a simulator or connected device"
echo "   - Press Cmd+R or click the play button"
echo ""
echo "🚀 Command line options:"
echo "   npm run ios                    # Run on default simulator"
echo "   npm run ios -- --device        # Run on connected device"
echo "   npm run ios -- --simulator=\"iPhone 15 Pro\"  # Run on specific simulator"
echo ""
echo "🛠️  Troubleshooting:"
echo "   - If build fails, try: cd ios && pod install"
echo "   - For Metro issues: npm start -- --reset-cache"
echo "   - Check Xcode build logs for detailed errors"

# Optionally open Xcode
read -p "Would you like to open Xcode now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    open MindfulMeals.xcworkspace
fi