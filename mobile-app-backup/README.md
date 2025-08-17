# MindfulMeals Mobile App

A beautiful, gamified nutrition and mindfulness app built with React Native, featuring Duolingo-style animations and user experience.

## 🚀 One-Click Setup

We've created automated setup scripts to get you up and running quickly!

### Quick Start

```bash
cd mobile-app
./setup.sh
```

This will launch an interactive menu where you can:
- 📱 Set up iOS (macOS only)
- 🤖 Set up Android (all platforms)
- 🚀 Set up both platforms
- 📚 View documentation
- 🧹 Clean installation

## 📋 Prerequisites

### Common Requirements
- **Node.js** v18 or higher
- **npm** or **yarn**
- **Git**

### iOS Development (macOS only)
- **macOS** Monterey or later
- **Xcode** 14.0 or later
- **CocoaPods**

### Android Development
- **Java JDK** 11 or higher
- **Android Studio** or Android SDK
- **Android SDK Platform 29+**

## 🏃‍♂️ Running the App

### iOS
```bash
npm run ios
# or specific simulator
npm run ios -- --simulator="iPhone 15 Pro"
```

### Android
```bash
npm run android
# Make sure emulator is running or device is connected
```

## 📁 Project Structure

```
mobile-app/
├── src/                    # Source code
│   ├── features/          # Feature-based modules
│   ├── ui/               # Reusable UI components
│   ├── navigation/       # Navigation configuration
│   ├── services/         # API and external services
│   └── utils/            # Utility functions
├── ios/                   # iOS native code
│   ├── setup-ios.sh      # iOS setup script
│   └── README.md         # iOS documentation
├── android/               # Android native code
│   ├── setup-android.sh  # Android setup script
│   └── README.md         # Android documentation
├── assets/               # Images, fonts, animations
└── setup.sh             # Main setup script
```

## 🎨 Tech Stack

- **React Native** 0.72.6
- **TypeScript** for type safety
- **React Navigation** for routing
- **React Native Reanimated** for smooth animations
- **Lottie** for delightful animations
- **React Native Paper** for Material Design
- **Zustand** for state management
- **React Query** for data fetching

## 🛠️ Development

### Start Metro Bundler
```bash
npm start
```

### Run Tests
```bash
npm test
```

### Lint Code
```bash
npm run lint
```

### Type Check
```bash
npm run type-check
```

## 🔧 Troubleshooting

### Metro Bundler Issues
```bash
npm start -- --reset-cache
```

### iOS Pod Issues
```bash
cd ios
pod deintegrate
pod install
```

### Android Build Issues
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Clean Everything
```bash
./setup.sh
# Select option 5 (Clean Installation)
```

## 📱 Platform-Specific Setup

### iOS Setup Details
See `ios/README.md` for detailed iOS setup instructions or run:
```bash
cd ios
./setup-ios.sh
```

### Android Setup Details
See `android/README.md` for detailed Android setup instructions or run:
```bash
cd android
./setup-android.sh
```

## 🎯 Features

- 🥗 **Nutrition Tracking** - Track meals with visual appeal
- 🧘 **Mindful Eating** - Guided exercises and reminders
- 🎮 **Gamification** - Streaks, achievements, and rewards
- 📊 **Progress Tracking** - Beautiful charts and insights
- 🎨 **Delightful UI** - Duolingo-inspired animations
- 🌙 **Dark Mode** - System-driven theme support
- 🌍 **Localization** - Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

Having issues with setup? Check:
- Platform-specific READMEs in `ios/` and `android/`
- Run `./setup.sh` and select "View Documentation"
- Check GitHub Issues

---

Built with ❤️ and mindfulness