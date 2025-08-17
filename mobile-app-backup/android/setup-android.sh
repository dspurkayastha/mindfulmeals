#!/bin/bash

# Android Setup Script for MindfulMeals
# This script automates the Android setup process for developers

echo "🤖 Android Setup for MindfulMeals"
echo "================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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
        "info") echo -e "ℹ️  $2" ;;
    esac
}

# Check for required tools
print_status "info" "Checking prerequisites..."

# Check for Node.js
if ! command_exists node; then
    print_status "error" "Node.js not found. Please install Node.js (v18+)"
    exit 1
else
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_status "warning" "Node.js version is less than 18. Please update for best compatibility"
    else
        print_status "success" "Node.js $(node -v) found"
    fi
fi

# Check for Java
if ! command_exists java; then
    print_status "error" "Java not found. Please install Java JDK 11 or higher"
    print_status "info" "You can install it using:"
    print_status "info" "  Ubuntu/Debian: sudo apt-get install openjdk-11-jdk"
    print_status "info" "  macOS: brew install openjdk@11"
    exit 1
else
    JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
    if [ "$JAVA_VERSION" -lt 11 ]; then
        print_status "warning" "Java version is less than 11. Please update"
    else
        print_status "success" "Java found"
    fi
fi

# Check for Android SDK
if [ -z "$ANDROID_HOME" ] && [ -z "$ANDROID_SDK_ROOT" ]; then
    print_status "warning" "ANDROID_HOME/ANDROID_SDK_ROOT not set"
    print_status "info" "Attempting to locate Android SDK..."
    
    # Common Android SDK locations
    POSSIBLE_SDK_PATHS=(
        "$HOME/Android/Sdk"
        "$HOME/Library/Android/sdk"
        "/usr/local/android-sdk"
        "/opt/android-sdk"
    )
    
    for path in "${POSSIBLE_SDK_PATHS[@]}"; do
        if [ -d "$path" ]; then
            export ANDROID_HOME="$path"
            export ANDROID_SDK_ROOT="$path"
            print_status "success" "Found Android SDK at $path"
            break
        fi
    done
    
    if [ -z "$ANDROID_HOME" ]; then
        print_status "error" "Android SDK not found. Please install Android Studio or SDK tools"
        print_status "info" "Visit: https://developer.android.com/studio"
        exit 1
    fi
else
    print_status "success" "Android SDK found at ${ANDROID_HOME:-$ANDROID_SDK_ROOT}"
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

# Initialize React Native Android project if needed
if [ ! -f "$SCRIPT_DIR/settings.gradle" ]; then
    print_status "info" "Initializing React Native Android project..."
    cd "$PROJECT_ROOT"
    npx react-native init MindfulMeals --directory temp_init --version 0.72.6
    
    # Copy Android files from temp init
    if [ -d "temp_init/android" ]; then
        cp -r temp_init/android/* "$SCRIPT_DIR/"
        rm -rf temp_init
        print_status "success" "Android project initialized"
    else
        print_status "error" "Failed to initialize Android project"
        exit 1
    fi
fi

# Update Android project settings
print_status "info" "Configuring Android project..."

# Update app/build.gradle for our dependencies
GRADLE_FILE="$SCRIPT_DIR/app/build.gradle"
if [ -f "$GRADLE_FILE" ]; then
    # Ensure proper Android configuration
    print_status "info" "Updating build.gradle configurations..."
    
    # Create a temporary file with updated configurations
    cat > "$GRADLE_FILE.tmp" << 'EOF'
apply plugin: "com.android.application"
apply plugin: "com.facebook.react"

import com.android.build.OutputFile

react {
    // Enable Hermes
    hermesEnabled = true
}

def enableProguardInReleaseBuilds = false
def jscFlavor = 'org.webkit:android-jsc:+'

android {
    ndkVersion rootProject.ext.ndkVersion
    compileSdkVersion rootProject.ext.compileSdkVersion

    namespace "com.mindfulmeals"
    
    defaultConfig {
        applicationId "com.mindfulmeals"
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
        versionCode 1
        versionName "1.0"
        
        // Add support for vector drawables
        vectorDrawables.useSupportLibrary = true
        
        // Add multiDex support
        multiDexEnabled true
    }
    
    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
    }
    
    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            signingConfig signingConfigs.debug
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
    
    packagingOptions {
        pickFirst '**/libc++_shared.so'
        pickFirst '**/libjsc.so'
    }
}

dependencies {
    implementation fileTree(dir: "libs", include: ["*.jar"])
    implementation "com.facebook.react:react-native:+"
    implementation "androidx.swiperefreshlayout:swiperefreshlayout:1.0.0"
    
    // Add required dependencies for our packages
    implementation 'com.facebook.fresco:animated-gif:2.6.0'
    implementation 'com.facebook.fresco:animated-webp:2.6.0'
    implementation 'com.facebook.fresco:webpsupport:2.6.0'
    
    if (hermesEnabled.toBoolean()) {
        implementation("com.facebook.react:hermes-android")
    } else {
        implementation jscFlavor
    }
}

apply from: file("../../node_modules/@react-native-community/cli-platform-android/native_modules.gradle"); applyNativeModulesAppBuildGradle(project)
EOF
    
    if [ -f "$GRADLE_FILE.tmp" ]; then
        mv "$GRADLE_FILE.tmp" "$GRADLE_FILE"
        print_status "success" "Updated app/build.gradle"
    fi
fi

# Configure Android Manifest permissions
MANIFEST_FILE="$SCRIPT_DIR/app/src/main/AndroidManifest.xml"
if [ -f "$MANIFEST_FILE" ]; then
    print_status "info" "Configuring Android permissions..."
    
    # Create a backup
    cp "$MANIFEST_FILE" "$MANIFEST_FILE.bak"
    
    # Add permissions before the application tag
    sed -i.tmp '/<application/i\
    <!-- Permissions for MindfulMeals -->\
    <uses-permission android:name="android.permission.INTERNET" />\
    <uses-permission android:name="android.permission.CAMERA" />\
    <uses-permission android:name="android.permission.VIBRATE" />\
    <uses-permission android:name="android.permission.RECORD_AUDIO" />\
    <uses-permission android:name="android.permission.WAKE_LOCK" />\
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />\
    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />\
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />\
    ' "$MANIFEST_FILE"
    
    # Clean up temp file
    rm -f "$MANIFEST_FILE.tmp"
    
    print_status "success" "Android permissions configured"
fi

# Create local.properties if it doesn't exist
LOCAL_PROPERTIES="$SCRIPT_DIR/local.properties"
if [ ! -f "$LOCAL_PROPERTIES" ]; then
    print_status "info" "Creating local.properties..."
    echo "sdk.dir=${ANDROID_HOME:-$ANDROID_SDK_ROOT}" > "$LOCAL_PROPERTIES"
    print_status "success" "local.properties created"
fi

# Link native dependencies
print_status "info" "Linking native dependencies..."
cd "$PROJECT_ROOT"
npx react-native link

# Clean and prepare build
print_status "info" "Cleaning build directories..."
cd "$SCRIPT_DIR"
if [ -d "./gradlew" ] || [ -f "./gradlew" ]; then
    chmod +x gradlew
    ./gradlew clean
fi

# Create debug keystore if it doesn't exist
DEBUG_KEYSTORE="$SCRIPT_DIR/app/debug.keystore"
if [ ! -f "$DEBUG_KEYSTORE" ]; then
    print_status "info" "Creating debug keystore..."
    keytool -genkey -v -keystore "$DEBUG_KEYSTORE" \
        -storepass android -alias androiddebugkey \
        -keypass android -keyalg RSA -keysize 2048 \
        -validity 10000 -dname "CN=Android Debug,O=Android,C=US"
    print_status "success" "Debug keystore created"
fi

print_status "success" "Android setup complete!"
echo ""
echo "📱 Next steps:"
echo "1. Connect an Android device via USB (with debugging enabled) or start an emulator"
echo "2. Run: npm run android"
echo "   OR"
echo "   cd $PROJECT_ROOT && npx react-native run-android"
echo ""
echo "🛠️  Troubleshooting:"
echo "- If Metro bundler doesn't start automatically, run: npm start"
echo "- For build issues, try: cd android && ./gradlew clean"
echo "- Ensure your device/emulator is connected: adb devices"