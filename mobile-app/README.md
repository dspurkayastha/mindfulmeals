# MindfulMeals Mobile App

React Native application for MindfulMeals - Nourish your body, mind, and soul.

## 🚀 Quick Start

This app is part of a monorepo structure. To get started:

```bash
# First-time setup (from this directory)
./scripts/setup-monorepo.sh

# Start Metro bundler
npm start

# Run on iOS (macOS only)
npm run ios

# Run on Android
npm run android
```

## 📱 Features

- Cross-platform React Native app (iOS & Android)
- TypeScript for type safety
- React Navigation for routing
- Zustand for state management
- React Native Paper UI components
- Lottie animations
- Internationalization support

## 🏗️ Architecture

This app follows a feature-based architecture:

```
src/
├── features/     # Feature modules
├── ui/          # Shared UI components
├── core/        # Core utilities and services
├── assets/      # Images, fonts, animations
└── utils/       # Helper functions
```

## 🔧 Scripts

- `npm start` - Start Metro bundler
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run clean` - Clean build artifacts
- `npm run pod-install` - Install iOS dependencies
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## 🛠️ Development

### Adding Dependencies

Always install packages using workspace commands:

```bash
# From workspace root
npm install <package> --workspace mobile-app

# Or from this directory
npm install <package>
```

### Troubleshooting

See [MONOREPO_GUIDE.md](./MONOREPO_GUIDE.md) for detailed troubleshooting steps.

### Testing

Run the monorepo validation tests:

```bash
./scripts/test-monorepo-setup.sh
```

## 📄 License

Private - All rights reserved