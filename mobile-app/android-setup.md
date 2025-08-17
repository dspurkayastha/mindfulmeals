# Android Setup Guide - MindfulMeals

## Prerequisites

- Android Studio (latest stable version)
- Java Development Kit (JDK) 11 or higher
- Android SDK with the following:
  - Android SDK Platform 31 or higher
  - Android SDK Build-Tools 31.0.0 or higher
  - Android Emulator (for testing)

## Initial Setup

If the Android directory doesn't exist, initialize it:

```bash
cd mobile-app
npx react-native init MindfulMeals --skip-install
# Copy the android folder from the newly created project
```

## Configuration Steps

### 1. Enable Hermes

Edit `android/app/build.gradle`:

```gradle
project.ext.react = [
    enableHermes: true,  // Enable Hermes for better performance
]
```

### 2. Configure Reanimated 3

Add to `android/app/build.gradle`:

```gradle
android {
    ...
    packagingOptions {
        pickFirst '**/libc++_shared.so'
        pickFirst '**/libjsc.so'
    }
}
```

Add to `MainApplication.java`:

```java
import com.swmansion.reanimated.ReanimatedPackage;
```

### 3. Configure Vector Icons

Edit `android/app/build.gradle`:

```gradle
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

### 4. Configure Lottie

No additional configuration needed for Lottie on Android - it works out of the box!

### 5. Configure Haptic Feedback

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.VIBRATE" />
```

### 6. Configure Permissions

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<!-- Camera permission for future barcode scanning -->
<uses-permission android:name="android.permission.CAMERA" />

<!-- Internet permission (already included by default) -->
<uses-permission android:name="android.permission.INTERNET" />

<!-- Vibration for haptic feedback -->
<uses-permission android:name="android.permission.VIBRATE" />
```

### 7. Update App Name and Package

1. In `android/app/src/main/res/values/strings.xml`:
```xml
<resources>
    <string name="app_name">MindfulMeals</string>
</resources>
```

2. Update package name in:
   - `android/app/build.gradle` (applicationId)
   - `android/app/src/main/java/com/mindfulmeals/MainActivity.java`
   - `android/app/src/main/java/com/mindfulmeals/MainApplication.java`
   - `android/app/src/main/AndroidManifest.xml`

### 8. ProGuard Rules

Add to `android/app/proguard-rules.pro`:

```pro
# React Native
-keep class com.facebook.react.** { *; }

# Reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# Lottie
-keep class com.airbnb.lottie.** { *; }
```

## Build Configuration

### Debug Build

```bash
cd android
./gradlew assembleDebug
```

### Release Build

1. Generate a signing key:
```bash
keytool -genkeypair -v -keystore mindfulmeals-release.keystore -alias mindfulmeals -keyalg RSA -keysize 2048 -validity 10000
```

2. Configure signing in `android/app/build.gradle`:
```gradle
signingConfigs {
    release {
        storeFile file('mindfulmeals-release.keystore')
        storePassword 'YOUR_STORE_PASSWORD'
        keyAlias 'mindfulmeals'
        keyPassword 'YOUR_KEY_PASSWORD'
    }
}
```

3. Build release APK:
```bash
cd android
./gradlew assembleRelease
```

## Running the App

### On Emulator
```bash
npx react-native run-android
```

### On Physical Device
1. Enable Developer Mode on your device
2. Enable USB Debugging
3. Connect device via USB
4. Run: `npx react-native run-android`

## Performance Optimization

1. **Enable Hermes**: Already configured above
2. **Enable ProGuard**: For release builds to reduce APK size
3. **Split APKs by ABI**: Add to `android/app/build.gradle`:
```gradle
splits {
    abi {
        enable true
        reset()
        include "armeabi-v7a", "arm64-v8a", "x86", "x86_64"
        universalApk false
    }
}
```

## Troubleshooting

### Build Failures

1. Clean project:
```bash
cd android
./gradlew clean
```

2. Reset Metro bundler:
```bash
npx react-native start --reset-cache
```

3. Clear React Native cache:
```bash
cd android
./gradlew cleanBuildCache
```

### Gradle Issues

1. Update Gradle wrapper:
```bash
cd android
./gradlew wrapper --gradle-version=7.5.1
```

2. Sync project:
```bash
cd android
./gradlew sync
```

### Metro Bundler Issues

If you see "Unable to load script from assets":
```bash
mkdir android/app/src/main/assets
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
```

## Mindfulness Features - Android Specific

1. **Haptic Feedback**: Uses Android's VibrationEffect API for precise patterns
2. **Background Audio**: Configure audio focus for meditation exercises
3. **Notifications**: For meal reminders and mindfulness prompts

## Next Steps

1. Test on multiple Android versions (API 21+)
2. Verify animations run at 60fps
3. Test haptic feedback on various devices
4. Ensure proper keyboard handling
5. Test on both phones and tablets