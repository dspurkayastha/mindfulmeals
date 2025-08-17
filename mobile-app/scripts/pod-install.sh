#!/bin/bash

# iOS Pod Installation Helper Script
# This script handles pod installation with proper configuration

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}📱 iOS Pod Installation Helper${NC}"
echo -e "${GREEN}==============================${NC}"

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
IOS_DIR="$SCRIPT_DIR/../ios"

# Check if on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo -e "${RED}❌ This script only works on macOS${NC}"
    exit 1
fi

# Load configuration if exists
if [ -f "$IOS_DIR/.pod-config" ]; then
    echo -e "${YELLOW}Loading pod configuration...${NC}"
    source "$IOS_DIR/.pod-config"
fi

cd "$IOS_DIR"

# Show current configuration
echo -e "\n${YELLOW}Current Configuration:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━"
echo "iOS Deployment Target: ${IOS_DEPLOYMENT_TARGET:-auto}"
echo "Flipper: ${NO_FLIPPER:-disabled}"
echo "Hermes: ${HERMES_ENABLED:-enabled}"
echo "Exclude Simulator ARM64: ${EXCLUDE_SIMULATOR_ARM64:-false}"
echo "━━━━━━━━━━━━━━━━━━━━━"

# Clean previous installation if requested
if [ "$1" == "--clean" ]; then
    echo -e "\n${YELLOW}Cleaning previous pod installation...${NC}"
    rm -rf Pods
    rm -f Podfile.lock
    pod cache clean --all
fi

# Check CocoaPods version
echo -e "\n${YELLOW}Checking CocoaPods version...${NC}"
POD_VERSION=$(pod --version)
echo "CocoaPods version: $POD_VERSION"

# Update repo if requested
if [ "$1" == "--repo-update" ] || [ "$2" == "--repo-update" ]; then
    echo -e "\n${YELLOW}Updating CocoaPods repo...${NC}"
    pod repo update
fi

# Install pods
echo -e "\n${YELLOW}Installing pods...${NC}"
pod install --verbose

# Verify installation
if [ -d "Pods" ] && [ -f "Podfile.lock" ]; then
    echo -e "\n${GREEN}✅ Pod installation completed successfully!${NC}"
    
    # Count installed pods
    POD_COUNT=$(grep -c "PODS:" Podfile.lock || echo "0")
    echo -e "${GREEN}📦 Installed pods: ~$POD_COUNT${NC}"
else
    echo -e "\n${RED}❌ Pod installation failed!${NC}"
    exit 1
fi

# Additional tips
echo -e "\n${YELLOW}Tips:${NC}"
echo "• If you encounter issues, try: $0 --clean"
echo "• To update pod repo: $0 --repo-update"
echo "• Edit ios/.pod-config to customize settings"
echo "• Open MindfulMeals.xcworkspace (not .xcodeproj) in Xcode"