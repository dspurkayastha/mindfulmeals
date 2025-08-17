# Android Setup Guide for MindfulMeals

## 🚀 Quick Start (One-Click Setup)

Run the automated setup script:

```bash
cd mobile-app/android
./setup-android.sh
```

This script will:
- ✅ Check all prerequisites
- ✅ Install npm dependencies
- ✅ Initialize Android project structure
- ✅ Configure build settings
- ✅ Set up permissions
- ✅ Create debug keystore
- ✅ Prepare for first build

## 📋 Prerequisites

Before running the setup, ensure you have:

### 1. **Node.js** (v18 or higher)
```bash
# Check version
node --version

# Install via NVM (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### 2. **Java JDK** (v11 or higher)
```bash
# Check version
java -version

# Install on Ubuntu/Debian
sudo apt-get update
sudo apt-get install openjdk-11-jdk

# Install on macOS
brew install openjdk@11

# Install on Windows
# Download from: https://adoptium.net/
```

### 3. **Android Studio** and SDK
1. Download from: https://developer.android.com/studio
2. During installation, ensure these are selected:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (AVD)

### 4. **Environment Variables**
Add to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.):

```bash
# Android SDK
export ANDROID_HOME=$HOME/Android/Sdk
export ANDROID_SDK_ROOT=$ANDROID_HOME
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Java (if not automatically set)
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64  # Linux
# export JAVA_HOME=$(/usr/libexec/java_home -v 11)   # macOS
```

Reload your shell:
```bash
source ~/.bashrc  # or ~/.zshrc
```

## 🛠️ Manual Setup Steps

If you prefer manual setup or the script fails:

### Step 1: Install Dependencies
```bash
cd mobile-app
npm install
```

### Step 2: Initialize Android Project
```bash
# If android folder is empty
npx react-native init MindfulMeals --directory temp_init --version 0.72.6
cp -r temp_init/android/* android/
rm -rf temp_init
```

### Step 3: Configure Project

#### Update `android/app/build.gradle`:
- Set `applicationId` to `"com.mindfulmeals"`
- Enable Hermes: `hermesEnabled = true`
- Set `minSdkVersion` to 21
- Enable multidex: `multiDexEnabled true`

#### Update `android/app/src/main/AndroidManifest.xml`:
Add permissions inside `<manifest>` tag:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

### Step 4: Create local.properties
```bash
cd android
echo "sdk.dir=$ANDROID_HOME" > local.properties
```

### Step 5: Create Debug Keystore
```bash
cd android/app
keytool -genkey -v -keystore debug.keystore \
    -storepass android -alias androiddebugkey \
    -keypass android -keyalg RSA -keysize 2048 \
    -validity 10000 -dname "CN=Android Debug,O=Android,C=US"
```

## 🚀 Running the App

### Using Physical Device
1. Enable Developer Options on your Android device
2. Enable USB Debugging
3. Connect device via USB
4. Verify connection:
   ```bash
   adb devices
   ```
5. Run the app:
   ```bash
   cd mobile-app
   npm run android
   ```

### Using Emulator
1. Open Android Studio
2. Open AVD Manager (Tools → AVD Manager)
3. Create a new Virtual Device (Pixel 6, API 33 recommended)
4. Start the emulator
5. Run the app:
   ```bash
   cd mobile-app
   npm run android
   ```

## 🔧 Common Issues & Solutions

### Issue: "SDK location not found"
```bash
cd android
echo "sdk.dir=$ANDROID_HOME" > local.properties
```

### Issue: "JAVA_HOME is not set"
```bash
# Find Java installation
which java
ls -la $(which java)

# Set JAVA_HOME in your shell profile
export JAVA_HOME=/path/to/java/home
```

### Issue: "Metro bundler not starting"
```bash
# In a separate terminal
cd mobile-app
npm start -- --reset-cache
```

### Issue: "Build failed with gradle error"
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Issue: "Device not authorized"
1. Disconnect and reconnect USB
2. Check device for authorization prompt
3. Select "Always allow from this computer"

### Issue: "Package signatures do not match"
```bash
# Uninstall existing app
adb uninstall com.mindfulmeals
# Rebuild and install
npm run android
```

## 📱 Build Variants

### Debug Build (Development)
```bash
cd android
./gradlew assembleDebug
# APK location: android/app/build/outputs/apk/debug/app-debug.apk
```

### Release Build (Production)
1. Generate release keystore:
   ```bash
   keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Configure signing in `android/app/build.gradle`

3. Build release APK:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

## 🎯 Next Steps

1. ✅ Run the setup script
2. ✅ Verify all prerequisites are installed
3. ✅ Connect device or start emulator
4. ✅ Run `npm run android`
5. ✅ Start developing!

## 📚 Additional Resources

- [React Native Environment Setup](https://reactnative.dev/docs/environment-setup)
- [Android Developer Documentation](https://developer.android.com/docs)
- [Troubleshooting Guide](https://reactnative.dev/docs/troubleshooting)

---

Need help? Check the logs in `android/app/build/outputs/logs/` or run with verbose logging:
```bash
npx react-native run-android --verbose
```