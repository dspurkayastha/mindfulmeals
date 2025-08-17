# Dynamic Podfile Configuration Guide

## Overview

The MindfulMeals iOS project now uses a **fully dynamic Podfile** that automatically adapts to your environment without requiring manual path adjustments.

## Key Features

### 1. Automatic Path Detection
The Podfile automatically searches for `node_modules` in these locations:
- `../node_modules` (standard React Native)
- `../../node_modules` (monorepo workspace)
- `../../../node_modules` (nested monorepo)

### 2. Environment-Based Configuration
Configure your build using environment variables instead of editing the Podfile:

```bash
# Example: Custom iOS deployment target
export IOS_DEPLOYMENT_TARGET=13.0
cd ios && pod install

# Example: Enable Flipper for debugging
export NO_FLIPPER=0
cd ios && pod install

# Example: M1 Mac simulator fix
export EXCLUDE_SIMULATOR_ARM64=true
cd ios && pod install
```

### 3. Dynamic App Name Detection
The Podfile automatically detects your Xcode project name from the `.xcodeproj` file.

## Configuration Options

### Using `.pod-config` File
Create or edit `ios/.pod-config` to set persistent configuration:

```bash
# iOS Deployment Target
export IOS_DEPLOYMENT_TARGET=12.4

# Disable Flipper for faster builds
export NO_FLIPPER=1

# Hermes configuration
export HERMES_ENABLED=true

# M1 Mac simulator compatibility
export EXCLUDE_SIMULATOR_ARM64=false

# Bitcode setting
export ENABLE_BITCODE=NO

# Suppress warnings
export SUPPRESS_POD_WARNINGS=false
```

### Available Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `IOS_DEPLOYMENT_TARGET` | `12.4` | Minimum iOS version |
| `NO_FLIPPER` | `1` | Disable Flipper (1=disabled, 0=enabled) |
| `HERMES_ENABLED` | `true` | Enable Hermes JS engine |
| `EXCLUDE_SIMULATOR_ARM64` | `false` | Exclude arm64 for simulator (M1 Macs) |
| `ENABLE_BITCODE` | `NO` | Enable bitcode |
| `SUPPRESS_POD_WARNINGS` | `false` | Suppress CocoaPods warnings |
| `USE_FRAMEWORKS` | none | Use frameworks (static/dynamic) |

## Usage Examples

### Standard Installation
```bash
cd ios
pod install
```

### Clean Installation
```bash
cd ios
../scripts/pod-install.sh --clean
```

### With Repository Update
```bash
cd ios
../scripts/pod-install.sh --repo-update
```

### Custom Configuration
```bash
# For older iOS support
export IOS_DEPLOYMENT_TARGET=11.0
cd ios && pod install

# For debugging with Flipper
export NO_FLIPPER=0
cd ios && pod install

# For CI/CD environments
export SUPPRESS_POD_WARNINGS=true
export NO_FLIPPER=1
cd ios && pod install
```

## Benefits

1. **No Manual Path Editing**: Works in any directory structure
2. **Environment Flexibility**: Different configs for dev/staging/prod
3. **CI/CD Ready**: Configure via environment variables
4. **M1 Mac Compatible**: Auto-detects and configures for Apple Silicon
5. **Monorepo Friendly**: Searches multiple locations for dependencies

## Troubleshooting

### Pod Install Fails
```bash
# Use the helper script with clean option
./scripts/pod-install.sh --clean
```

### Can't Find node_modules
The Podfile will show searched paths. Ensure you've run:
```bash
npm install
```

### M1 Mac Simulator Issues
```bash
export EXCLUDE_SIMULATOR_ARM64=true
cd ios && pod install
```

### Custom node_modules Location
```bash
# If node_modules is in a non-standard location
export NODE_MODULES_PATH=/custom/path/to/node_modules
cd ios && pod install
```

## Migration from Static Podfile

If migrating from a static Podfile:

1. **Backup your old Podfile**: `cp Podfile Podfile.backup`
2. **Use the new dynamic Podfile** (already in place)
3. **Clean and reinstall**:
   ```bash
   rm -rf Pods Podfile.lock
   pod install
   ```

## Best Practices

1. **Use `.pod-config`** for project-wide settings
2. **Use environment variables** for temporary overrides
3. **Commit `.pod-config`** to version control
4. **Don't commit** `Pods/` directory
5. **Do commit** `Podfile.lock` for reproducible builds

## Advanced Usage

### Multiple Configurations
```bash
# Development
export IOS_DEPLOYMENT_TARGET=12.0
export NO_FLIPPER=0
pod install

# Production
export IOS_DEPLOYMENT_TARGET=13.0
export NO_FLIPPER=1
export ENABLE_BITCODE=YES
pod install
```

### CI/CD Pipeline
```yaml
# Example GitHub Actions
- name: Install Pods
  run: |
    export NO_FLIPPER=1
    export SUPPRESS_POD_WARNINGS=true
    cd ios && pod install
```

## Summary

The dynamic Podfile eliminates manual configuration and "works everywhere" - from local development to CI/CD pipelines, from standard React Native apps to complex monorepos. Just run `pod install` and it adapts to your environment automatically!