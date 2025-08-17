#!/bin/bash
# setup-monorepo.sh - Setup script for React Native Monorepo

set -e  # Exit on error

echo "🚀 Setting up React Native Monorepo..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

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

# Check Node.js version
check_node_version() {
    local required_version="18.0.0"
    local node_version=$(node -v | cut -d'v' -f2)
    
    if [ "$(printf '%s\n' "$required_version" "$node_version" | sort -V | head -n1)" != "$required_version" ]; then
        print_error "Node.js version $node_version is below required version $required_version"
        exit 1
    fi
    print_success "Node.js version $node_version meets requirements"
}

# Set NODE_BINARY
export NODE_BINARY=$(find_node)
print_info "Using Node: $NODE_BINARY"

# Check Node version
check_node_version

# Get the workspace root (two levels up from this script)
WORKSPACE_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
MOBILE_APP_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

print_info "Workspace root: $WORKSPACE_ROOT"
print_info "Mobile app root: $MOBILE_APP_ROOT"

# Clean everything
print_info "Cleaning project..."
cd "$WORKSPACE_ROOT"

# Remove node_modules and lock files
rm -rf node_modules package-lock.json
find . -name 'node_modules' -type d -prune -exec rm -rf '{}' + 2>/dev/null || true

# Clean iOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    print_info "Cleaning iOS build artifacts..."
    cd "$MOBILE_APP_ROOT/ios"
    rm -rf Pods build
    rm -f Podfile.lock
fi

# Clean Android
print_info "Cleaning Android build artifacts..."
cd "$MOBILE_APP_ROOT/android"
./gradlew clean 2>/dev/null || true

# Install dependencies
print_info "Installing dependencies..."
cd "$WORKSPACE_ROOT"
npm install

# iOS Setup
if [[ "$OSTYPE" == "darwin"* ]]; then
    print_info "Setting up iOS..."
    cd "$MOBILE_APP_ROOT/ios"
    
    # Create/Update .xcode.env.local
    echo "export NODE_BINARY=$NODE_BINARY" > .xcode.env.local
    echo "export NODE_OPTIONS=\"--max-old-space-size=8192\"" >> .xcode.env.local
    print_success "Created .xcode.env.local"
    
    # Install CocoaPods if not installed
    if ! command -v pod &> /dev/null; then
        print_info "Installing CocoaPods..."
        sudo gem install cocoapods
    fi
    
    # Install pods
    print_info "Installing CocoaPods dependencies..."
    pod install --repo-update
    
    if [ $? -eq 0 ]; then
        print_success "iOS setup completed successfully"
    else
        print_error "iOS pod installation failed"
        exit 1
    fi
fi

# Android Setup
print_info "Setting up Android..."
cd "$MOBILE_APP_ROOT/android"

# Check for Android SDK
if [ -z "$ANDROID_HOME" ] && [ -z "$ANDROID_SDK_ROOT" ]; then
    print_error "ANDROID_HOME or ANDROID_SDK_ROOT not set. Please set up Android SDK environment."
    print_info "You can still run the app if Android Studio is properly configured."
fi

# Verify gradle wrapper
if [ ! -f "./gradlew" ]; then
    print_error "Gradle wrapper not found"
    exit 1
fi

# Make gradlew executable
chmod +x ./gradlew

# Try to build to download dependencies
print_info "Downloading Android dependencies..."
./gradlew dependencies --no-daemon 2>/dev/null || true

print_success "Android setup completed"

# Create patches directory for patch-package
mkdir -p "$WORKSPACE_ROOT/patches"

# Final checks
cd "$MOBILE_APP_ROOT"

print_info "Running final checks..."

# Check if react-native is accessible
if [ -f "$WORKSPACE_ROOT/node_modules/react-native/package.json" ]; then
    print_success "React Native found in workspace node_modules"
else
    print_error "React Native not found in expected location"
    exit 1
fi

# Summary
echo ""
echo "========================================"
echo -e "${GREEN}✅ Setup completed successfully!${NC}"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Start Metro: cd mobile-app && npm start"
echo "2. Run iOS: cd mobile-app && npm run ios"
echo "3. Run Android: cd mobile-app && npm run android"
echo ""
echo "Troubleshooting:"
echo "- If iOS build fails, try: cd ios && pod install"
echo "- If Android build fails, try: cd android && ./gradlew clean"
echo "- For Metro issues, try: npm start -- --reset-cache"
echo ""