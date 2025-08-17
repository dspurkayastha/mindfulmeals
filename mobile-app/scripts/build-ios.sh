#!/bin/bash
# build-ios.sh - Build script for iOS in monorepo

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Ensure we're using the correct node
export NODE_BINARY=$(which node)
print_info "Using Node: $NODE_BINARY"

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
MOBILE_APP_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
IOS_DIR="$MOBILE_APP_ROOT/ios"

print_info "Building iOS app..."
cd "$IOS_DIR"

# Check if pods are installed
if [ ! -d "Pods" ]; then
    print_info "Pods directory not found. Running pod install..."
    pod install
fi

# Parse arguments
CONFIGURATION="Debug"
SCHEME="MindfulMeals"
CLEAN=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --release)
            CONFIGURATION="Release"
            shift
            ;;
        --clean)
            CLEAN=true
            shift
            ;;
        --scheme)
            SCHEME="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [--release] [--clean] [--scheme SCHEME_NAME]"
            exit 1
            ;;
    esac
done

# Clean if requested
if [ "$CLEAN" = true ]; then
    print_info "Cleaning build artifacts..."
    xcodebuild clean -workspace MindfulMeals.xcworkspace -scheme "$SCHEME" -configuration "$CONFIGURATION"
fi

# Build the app
print_info "Building with configuration: $CONFIGURATION"
print_info "Using scheme: $SCHEME"

xcodebuild \
    -workspace MindfulMeals.xcworkspace \
    -scheme "$SCHEME" \
    -configuration "$CONFIGURATION" \
    -sdk iphonesimulator \
    -derivedDataPath build \
    -allowProvisioningUpdates \
    ONLY_ACTIVE_ARCH=YES

if [ $? -eq 0 ]; then
    print_success "iOS build completed successfully!"
    print_info "Build artifacts are in: $IOS_DIR/build"
else
    print_error "iOS build failed!"
    exit 1
fi