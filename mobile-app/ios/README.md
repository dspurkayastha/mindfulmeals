# iOS Setup Guide for MindfulMeals

## 🚀 Quick Start (One-Click Setup)

Run the automated setup script:

```bash
cd mobile-app/ios
./setup-ios.sh
```

This script will:
- ✅ Check macOS compatibility
- ✅ Verify Xcode installation
- ✅ Install CocoaPods
- ✅ Install npm dependencies
- ✅ Configure iOS project settings
- ✅ Set up permissions
- ✅ Install pods
- ✅ Prepare for first build

## 📋 Prerequisites

### 1. **macOS** (Required)
iOS development requires macOS. No exceptions.

### 2. **Xcode** (Latest stable version)
```bash
# Install from Mac App Store
# Then run:
sudo xcode-select --switch /Applications/Xcode.app
sudo xcodebuild -license accept
```

### 3. **Node.js** (v18 or higher)
```bash
# Check version
node --version

# Install via Homebrew
brew install node

# Or via NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### 4. **CocoaPods**
```bash
# Install via RubyGems
sudo gem install cocoapods

# Or via Homebrew
brew install cocoapods
```

### 5. **Apple Developer Account** (for device testing)
- Free account: https://developer.apple.com/
- Paid account required for App Store distribution

## 🛠️ Manual Setup Steps

If you prefer manual setup or the script fails:

### Step 1: Install Dependencies
```bash
cd mobile-app
npm install
```

### Step 2: Install CocoaPods
```bash
cd ios
pod install
```

### Step 3: Configure Xcode Project

1. Open the workspace (not the project!):
   ```bash
   open MindfulMeals.xcworkspace
   ```

2. Configure signing:
   - Select the project in the navigator
   - Go to "Signing & Capabilities" tab
   - Select your team from the dropdown
   - Let Xcode manage signing automatically

3. Update bundle identifier (if needed):
   - Change from `com.mindfulmeals` to `com.yourcompany.mindfulmeals`

### Step 4: Configure Permissions

Edit `ios/MindfulMeals/Info.plist` to add required permissions:

```xml
<key>NSCameraUsageDescription</key>
<string>MindfulMeals needs camera access to scan food barcodes for easy nutrition tracking</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>MindfulMeals needs photo access to save and share your meal images</string>

<key>NSMicrophoneUsageDescription</key>
<string>MindfulMeals uses your microphone for voice-guided mindfulness exercises</string>

<key>NSMotionUsageDescription</key>
<string>MindfulMeals tracks your activity to provide personalized nutrition recommendations</string>

<!-- For development only -->
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

### Step 5: Configure Capabilities

In Xcode, under "Signing & Capabilities":
- Add Push Notifications
- Add HealthKit (if using health features)
- Add Background Modes (for notifications)

## 🚀 Running the App

### Using Simulator

1. **List available simulators:**
   ```bash
   xcrun simctl list devices
   ```

2. **Run on default simulator:**
   ```bash
   cd mobile-app
   npm run ios
   ```

3. **Run on specific simulator:**
   ```bash
   npm run ios -- --simulator="iPhone 15 Pro"
   ```

### Using Physical Device

1. **Connect device via USB**

2. **Trust the computer on your device**

3. **Select device in Xcode**

4. **Run:**
   ```bash
   npm run ios -- --device
   ```

   Or use Xcode's Run button (⌘R)

## 🔧 Common Issues & Solutions

### Issue: "Command PhaseScriptExecution failed"
```bash
cd ios
pod deintegrate
pod install
```

### Issue: "Unable to boot simulator"
```bash
# Reset simulator
xcrun simctl shutdown all
xcrun simctl erase all
```

### Issue: "No bundle URL present"
```bash
# Start Metro bundler manually
cd mobile-app
npm start -- --reset-cache

# Then run in new terminal
npm run ios
```

### Issue: "Code signing error"
1. Open Xcode
2. Go to Signing & Capabilities
3. Uncheck "Automatically manage signing"
4. Check it again
5. Select your team

### Issue: "Pod install fails"
```bash
# Update CocoaPods
sudo gem update cocoapods

# Clear caches
cd ios
rm -rf Pods Podfile.lock
pod cache clean --all
pod install --repo-update
```

### Issue: "Build input file cannot be found"
1. Clean build folder: ⌘⇧K in Xcode
2. Delete derived data:
   ```bash
   rm -rf ~/Library/Developer/Xcode/DerivedData
   ```

## 📱 Build Variants

### Debug Build (Development)
```bash
# From command line
cd ios
xcodebuild -workspace MindfulMeals.xcworkspace \
  -scheme MindfulMeals \
  -configuration Debug \
  -sdk iphonesimulator \
  -derivedDataPath build
```

### Release Build (Production)

1. **Configure release scheme in Xcode:**
   - Product → Scheme → Edit Scheme
   - Set Build Configuration to Release

2. **Build for device:**
   ```bash
   xcodebuild -workspace MindfulMeals.xcworkspace \
     -scheme MindfulMeals \
     -configuration Release \
     -sdk iphoneos \
     -derivedDataPath build \
     -archivePath build/MindfulMeals.xcarchive \
     archive
   ```

3. **Export IPA:**
   ```bash
   xcodebuild -exportArchive \
     -archivePath build/MindfulMeals.xcarchive \
     -exportPath build \
     -exportOptionsPlist ExportOptions.plist
   ```

## 🧪 Testing

### Run unit tests:
```bash
npm test
```

### Run iOS-specific tests:
```bash
xcodebuild test \
  -workspace ios/MindfulMeals.xcworkspace \
  -scheme MindfulMeals \
  -destination 'platform=iOS Simulator,name=iPhone 15'
```

## 🎯 Performance Optimization

### Enable Hermes
Already configured in the setup script. Verify in `ios/Podfile`:
```ruby
:hermes_enabled => true
```

### Enable ProGuard (Release builds)
Configure in Xcode build settings for smaller app size.

### Use App Thinning
Automatically enabled for App Store builds.

## 🚢 App Store Preparation

1. **Create App Store Connect record**
2. **Generate screenshots** (6.5", 5.5" displays)
3. **Prepare app metadata**
4. **Create App Store icons** (1024x1024)
5. **Test with TestFlight**

## 📚 Additional Resources

- [React Native iOS Guide](https://reactnative.dev/docs/running-on-device)
- [CocoaPods Troubleshooting](https://guides.cocoapods.org/using/troubleshooting.html)
- [Xcode Documentation](https://developer.apple.com/documentation/xcode)
- [App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)

---

Need help? Check the logs:
- Metro: Terminal running `npm start`
- Xcode: Build logs in Xcode console
- Device: Console.app on macOS