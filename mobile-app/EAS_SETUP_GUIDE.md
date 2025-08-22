# EAS (Expo Application Services) Setup Guide

This guide will help you set up and use EAS for building and deploying the MindfulMeals app.

## Prerequisites

1. **Expo Account**: Create an account at [expo.dev](https://expo.dev)
2. **EAS CLI**: Already installed globally via `npm install -g eas-cli`
3. **Project Setup**: The project is already configured with EAS

## Initial Setup

### 1. Login to EAS

```bash
eas login
```

Enter your Expo account credentials when prompted.

### 2. Verify Project Configuration

The project is already linked with EAS project ID: `20500198-5703-48f8-9bdd-379925c60cbf`

To verify:
```bash
eas project:info
```

## Build Profiles

We have configured the following build profiles in `eas.json`:

### Development Build
- **Purpose**: Local development with dev client
- **Features**: Debug mode, dev menu, faster builds
- **Command**: `npm run eas:build:dev`

### Debug Build
- **Purpose**: Local debugging without credentials
- **Features**: Runs locally, no signing required
- **Command**: `npm run eas:build:debug`

### Preview Build
- **Purpose**: Internal testing and QA
- **Features**: Release mode, internal distribution
- **Command**: `npm run eas:build:preview`

### Production Build
- **Purpose**: App Store/Play Store submission
- **Features**: Optimized, signed, auto-increment version
- **Command**: `npm run eas:build:prod`

## Environment Variables

Environment variables are configured per build profile in `eas.json`. Each profile has:

- `EXPO_PUBLIC_API_URL`: API endpoint
- `EXPO_PUBLIC_ENV`: Environment name
- Additional flags for debugging and features

## Building the App

### Build for Both Platforms
```bash
npm run eas:build:dev
```

### Build for Specific Platform
```bash
npm run eas:build:dev:android
npm run eas:build:dev:ios
```

### Local Build (Debug Profile)
```bash
npm run eas:build:debug
```

## Managing Devices (iOS)

For iOS internal distribution, register devices:

```bash
npm run eas:device:create
```

Follow the prompts to add device UDIDs.

## Debugging Cloud Builds

### 1. View Build Logs
```bash
eas build:list
eas build:view <build-id>
```

### 2. Download Build Artifacts
After a successful build:
```bash
eas build:download --platform=android
eas build:download --platform=ios
```

### 3. Common Issues and Solutions

#### Build Failures
- Check logs for missing dependencies
- Verify environment variables in `eas.json`
- Ensure all native dependencies are properly configured

#### iOS Signing Issues
- Run `eas credentials` to manage certificates
- For development builds, use automatic signing

#### Android Build Issues
- Check `android/gradle.properties` for correct settings
- Verify package name matches in all config files

## Submitting to Stores

### Prerequisites
1. Configure store credentials:
   ```bash
   eas credentials
   ```

2. Update `ascAppId` in `eas.json` for iOS

### Submit Build
```bash
npm run eas:submit
```

## OTA Updates

For quick JavaScript-only updates:

```bash
npm run eas:update "Update message here"
```

## Best Practices

1. **Version Management**: Let EAS handle version incrementing for production builds
2. **Environment Variables**: Use `EXPO_PUBLIC_` prefix for client-side variables
3. **Caching**: Build caches are configured per profile for faster builds
4. **Testing**: Always test preview builds before production
5. **Debugging**: Use development builds with dev client for better debugging

## Monitoring Builds

Visit the [Expo dashboard](https://expo.dev) to:
- Monitor build progress
- View build history
- Download artifacts
- Manage team members
- Configure webhooks

## Troubleshooting

### Clear Build Cache
```bash
eas build --clear-cache --profile development
```

### Reset Credentials
```bash
eas credentials --platform ios
eas credentials --platform android
```

### Local Environment Issues
Ensure you have:
- Latest EAS CLI: `npm install -g eas-cli@latest`
- Correct Node version (check `.nvmrc`)
- All dependencies installed: `npm install`

## Support

- [EAS Documentation](https://docs.expo.dev/eas/)
- [Expo Forums](https://forums.expo.dev/)
- [GitHub Issues](https://github.com/expo/eas-cli/issues)