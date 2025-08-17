#!/bin/bash

# MindfulMeals Mobile App Setup Script
# This script helps you set up the mobile app for either iOS or Android development

echo "🍎 MindfulMeals Mobile App Setup"
echo "================================"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    case $1 in
        "success") echo -e "${GREEN}✅ $2${NC}" ;;
        "error") echo -e "${RED}❌ $2${NC}" ;;
        "warning") echo -e "${YELLOW}⚠️  $2${NC}" ;;
        "info") echo -e "${BLUE}ℹ️  $2${NC}" ;;
        "purple") echo -e "${PURPLE}$2${NC}" ;;
    esac
}

# Detect operating system
detect_os() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "linux"
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        echo "windows"
    else
        echo "unknown"
    fi
}

OS=$(detect_os)

# Display OS information
print_status "info" "Detected OS: $OS"

# Function to display the menu
show_menu() {
    echo ""
    print_status "purple" "Please select your target platform:"
    echo ""
    echo "  1) 📱 iOS (macOS only)"
    echo "  2) 🤖 Android (All platforms)"
    echo "  3) 🚀 Both (macOS only)"
    echo "  4) 📚 View Documentation"
    echo "  5) 🧹 Clean Installation"
    echo "  6) ❌ Exit"
    echo ""
}

# Function to check if we can run iOS setup
can_run_ios() {
    if [[ "$OS" == "macos" ]]; then
        return 0
    else
        print_status "error" "iOS development requires macOS"
        print_status "info" "You can still develop for Android on $OS"
        return 1
    fi
}

# Function to run iOS setup
run_ios_setup() {
    if can_run_ios; then
        print_status "info" "Starting iOS setup..."
        if [ -f "./ios/setup-ios.sh" ]; then
            chmod +x ./ios/setup-ios.sh
            ./ios/setup-ios.sh
        else
            print_status "error" "iOS setup script not found at ./ios/setup-ios.sh"
        fi
    fi
}

# Function to run Android setup
run_android_setup() {
    print_status "info" "Starting Android setup..."
    if [ -f "./android/setup-android.sh" ]; then
        chmod +x ./android/setup-android.sh
        ./android/setup-android.sh
    else
        print_status "error" "Android setup script not found at ./android/setup-android.sh"
    fi
}

# Function to show documentation
show_documentation() {
    echo ""
    print_status "purple" "📚 Documentation Available:"
    echo ""
    echo "  1) iOS Setup Guide (ios/README.md)"
    echo "  2) Android Setup Guide (android/README.md)"
    echo "  3) Back to main menu"
    echo ""
    read -p "Select option (1-3): " doc_choice
    
    case $doc_choice in
        1)
            if [ -f "./ios/README.md" ]; then
                less ./ios/README.md
            else
                print_status "error" "iOS documentation not found"
            fi
            ;;
        2)
            if [ -f "./android/README.md" ]; then
                less ./android/README.md
            else
                print_status "error" "Android documentation not found"
            fi
            ;;
        3)
            return
            ;;
        *)
            print_status "warning" "Invalid selection"
            ;;
    esac
}

# Function to clean installation
clean_installation() {
    print_status "warning" "This will clean all build artifacts and dependencies"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "info" "Cleaning project..."
        
        # Clean node modules
        rm -rf node_modules
        print_status "success" "Removed node_modules"
        
        # Clean iOS
        if [ -d "ios" ]; then
            cd ios
            pod deintegrate 2>/dev/null || true
            rm -rf Pods Podfile.lock build
            cd ..
            print_status "success" "Cleaned iOS artifacts"
        fi
        
        # Clean Android
        if [ -d "android" ]; then
            cd android
            if [ -f "gradlew" ]; then
                chmod +x gradlew
                ./gradlew clean 2>/dev/null || true
            fi
            rm -rf .gradle build app/build
            cd ..
            print_status "success" "Cleaned Android artifacts"
        fi
        
        # Clean Metro cache
        rm -rf $TMPDIR/metro-* 2>/dev/null || true
        rm -rf $TMPDIR/react-* 2>/dev/null || true
        print_status "success" "Cleaned Metro cache"
        
        print_status "success" "Cleanup complete!"
        print_status "info" "Run setup again to reinstall"
    else
        print_status "info" "Cleanup cancelled"
    fi
}

# Function to check prerequisites
check_prerequisites() {
    print_status "info" "Checking common prerequisites..."
    
    # Check Node.js
    if command -v node >/dev/null 2>&1; then
        NODE_VERSION=$(node -v)
        print_status "success" "Node.js $NODE_VERSION found"
    else
        print_status "error" "Node.js not found. Please install Node.js v18+"
        return 1
    fi
    
    # Check npm
    if command -v npm >/dev/null 2>&1; then
        NPM_VERSION=$(npm -v)
        print_status "success" "npm $NPM_VERSION found"
    else
        print_status "error" "npm not found"
        return 1
    fi
    
    return 0
}

# Main menu loop
main() {
    # Show welcome message
    echo ""
    print_status "purple" "Welcome to MindfulMeals Mobile Setup!"
    echo "This script will help you set up your development environment."
    echo ""
    
    # Check prerequisites first
    if ! check_prerequisites; then
        print_status "error" "Please install the missing prerequisites and run again"
        exit 1
    fi
    
    while true; do
        show_menu
        read -p "Enter your choice (1-6): " choice
        
        case $choice in
            1)
                run_ios_setup
                ;;
            2)
                run_android_setup
                ;;
            3)
                if can_run_ios; then
                    print_status "info" "Setting up both platforms..."
                    run_ios_setup
                    echo ""
                    run_android_setup
                else
                    print_status "info" "Setting up Android only (iOS requires macOS)..."
                    run_android_setup
                fi
                ;;
            4)
                show_documentation
                ;;
            5)
                clean_installation
                ;;
            6)
                print_status "info" "Exiting setup. Happy coding! 🚀"
                exit 0
                ;;
            *)
                print_status "warning" "Invalid selection. Please choose 1-6."
                ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
    done
}

# Run main function
main