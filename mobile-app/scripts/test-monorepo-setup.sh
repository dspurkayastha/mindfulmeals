#!/bin/bash
# test-monorepo-setup.sh - Test script to validate monorepo setup

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Test results
TESTS_PASSED=0
TESTS_FAILED=0

print_test_header() {
    echo -e "\n${BLUE}═══════════════════════════════════════${NC}"
    echo -e "${BLUE}🧪 $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((TESTS_PASSED++))
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
    ((TESTS_FAILED++))
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Get directories
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
MOBILE_APP_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
WORKSPACE_ROOT="$(cd "$MOBILE_APP_ROOT/.." && pwd)"

echo -e "${BLUE}🧪 Testing React Native Monorepo Setup${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"

# Test 1: Check workspace structure
print_test_header "Test 1: Workspace Structure"

if [ -d "$WORKSPACE_ROOT/node_modules" ]; then
    print_success "Root node_modules exists"
else
    print_error "Root node_modules not found"
fi

if [ -f "$WORKSPACE_ROOT/package.json" ]; then
    print_success "Root package.json exists"
else
    print_error "Root package.json not found"
fi

# Test 2: Check React Native installation
print_test_header "Test 2: React Native Installation"

if [ -d "$WORKSPACE_ROOT/node_modules/react-native" ]; then
    print_success "React Native found in root node_modules"
    
    # Check version
    RN_VERSION=$(node -e "console.log(require('$WORKSPACE_ROOT/node_modules/react-native/package.json').version)")
    print_info "React Native version: $RN_VERSION"
else
    print_error "React Native not found in root node_modules"
fi

# Test 3: Metro configuration
print_test_header "Test 3: Metro Configuration"

if [ -f "$MOBILE_APP_ROOT/metro.config.js" ]; then
    print_success "Metro config file exists"
    
    # Check if it has monorepo configuration
    if grep -q "watchFolders" "$MOBILE_APP_ROOT/metro.config.js"; then
        print_success "Metro config has watchFolders for monorepo"
    else
        print_error "Metro config missing watchFolders configuration"
    fi
else
    print_error "Metro config file not found"
fi

# Test 4: iOS Setup (macOS only)
if [[ "$OSTYPE" == "darwin"* ]]; then
    print_test_header "Test 4: iOS Setup"
    
    if [ -f "$MOBILE_APP_ROOT/ios/Podfile" ]; then
        print_success "Podfile exists"
        
        # Check monorepo paths in Podfile
        if grep -q "../../../node_modules" "$MOBILE_APP_ROOT/ios/Podfile"; then
            print_success "Podfile has correct monorepo paths"
        else
            print_error "Podfile missing monorepo path configuration"
        fi
    else
        print_error "Podfile not found"
    fi
    
    if [ -f "$MOBILE_APP_ROOT/ios/.xcode.env.local" ]; then
        print_success ".xcode.env.local exists"
    else
        print_error ".xcode.env.local not found"
    fi
    
    if [ -d "$MOBILE_APP_ROOT/ios/Pods" ]; then
        print_success "Pods directory exists"
    else
        print_info "Pods directory not found (run pod install)"
    fi
else
    print_info "Skipping iOS tests (not on macOS)"
fi

# Test 5: Android Setup
print_test_header "Test 5: Android Setup"

if [ -f "$MOBILE_APP_ROOT/android/settings.gradle" ]; then
    print_success "Android settings.gradle exists"
    
    # Check monorepo paths
    if grep -q "../../../node_modules" "$MOBILE_APP_ROOT/android/settings.gradle"; then
        print_success "Android settings.gradle has correct monorepo paths"
    else
        print_error "Android settings.gradle missing monorepo paths"
    fi
else
    print_error "Android settings.gradle not found"
fi

if [ -f "$MOBILE_APP_ROOT/android/gradle.properties" ]; then
    print_success "gradle.properties exists"
    
    if grep -q "reactNativeDir=../../../node_modules/react-native" "$MOBILE_APP_ROOT/android/gradle.properties"; then
        print_success "gradle.properties has correct React Native path"
    else
        print_error "gradle.properties missing React Native path"
    fi
else
    print_error "gradle.properties not found"
fi

# Test 6: Package naming
print_test_header "Test 6: Package Configuration"

if [ -f "$MOBILE_APP_ROOT/package.json" ]; then
    PACKAGE_NAME=$(node -e "console.log(require('$MOBILE_APP_ROOT/package.json').name)")
    if [[ "$PACKAGE_NAME" == "@mindfulmeals/mobile-app" ]]; then
        print_success "Package name is correctly scoped: $PACKAGE_NAME"
    else
        print_error "Package name incorrect: $PACKAGE_NAME (expected @mindfulmeals/mobile-app)"
    fi
else
    print_error "mobile-app package.json not found"
fi

# Test 7: Metro bundler
print_test_header "Test 7: Metro Bundler Test"

print_info "Starting Metro bundler test..."
cd "$MOBILE_APP_ROOT"

# Start Metro in background
timeout 20s npx react-native start --reset-cache > /tmp/metro-test.log 2>&1 &
METRO_PID=$!

sleep 10

if ps -p $METRO_PID > /dev/null 2>&1; then
    print_success "Metro bundler started successfully"
    kill $METRO_PID 2>/dev/null || true
else
    print_error "Metro bundler failed to start"
    print_info "Check /tmp/metro-test.log for details"
fi

# Test 8: Build command availability
print_test_header "Test 8: Build Commands"

cd "$MOBILE_APP_ROOT"

if command -v npx react-native &> /dev/null; then
    print_success "react-native CLI is available"
else
    print_error "react-native CLI not available"
fi

# Test Summary
echo -e "\n${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}📊 Test Summary${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All tests passed! Your monorepo is properly configured.${NC}"
    exit 0
else
    echo -e "\n${RED}⚠️  Some tests failed. Please fix the issues above.${NC}"
    exit 1
fi