#!/bin/bash

# Quick fix script for iOS Podfile issue

echo "🔧 Fixing iOS Podfile issue..."

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Navigate to iOS directory
cd "$SCRIPT_DIR"

# Check if we need to create the Xcode project
if [ ! -d "MindfulMeals.xcodeproj" ]; then
    echo "⚠️  Xcode project not found. Creating it now..."
    
    # Create a temporary React Native project
    cd "$PROJECT_ROOT"
    npx react-native@0.72.6 init MindfulMealsTemp --version 0.72.6 --skip-install
    
    if [ -d "MindfulMealsTemp/ios" ]; then
        echo "📁 Copying iOS project files..."
        
        # Copy and rename the Xcode project
        cp -r MindfulMealsTemp/ios/MindfulMealsTemp.xcodeproj "$SCRIPT_DIR/MindfulMeals.xcodeproj"
        
        # Update project name in all relevant files
        cd "$SCRIPT_DIR/MindfulMeals.xcodeproj"
        if [ -f "project.pbxproj" ]; then
            sed -i '' 's/MindfulMealsTemp/MindfulMeals/g' project.pbxproj
        fi
        
        # Rename scheme file if it exists
        if [ -d "xcshareddata/xcschemes" ]; then
            cd xcshareddata/xcschemes
            if [ -f "MindfulMealsTemp.xcscheme" ]; then
                mv MindfulMealsTemp.xcscheme MindfulMeals.xcscheme
                sed -i '' 's/MindfulMealsTemp/MindfulMeals/g' MindfulMeals.xcscheme
            fi
        fi
        
        # Clean up
        cd "$PROJECT_ROOT"
        rm -rf MindfulMealsTemp
        
        echo "✅ Xcode project created successfully"
    else
        echo "❌ Failed to create temporary project"
        exit 1
    fi
else
    echo "✅ Xcode project already exists"
fi

# Navigate back to iOS directory
cd "$SCRIPT_DIR"

# Clean and reinstall pods
echo "🧹 Cleaning previous pod installation..."
pod deintegrate 2>/dev/null || true
rm -rf Pods Podfile.lock

echo "📦 Installing pods..."
pod install

if [ $? -eq 0 ]; then
    echo "✅ Pods installed successfully!"
    echo ""
    echo "You can now run: npm run ios"
else
    echo "❌ Pod installation failed"
    echo "Try running: pod install --verbose"
fi