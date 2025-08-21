// Metro configuration for Expo + RN 0.81 with New Architecture
// Adds polyfill mappings and custom resolver for Hermes/Winter compatibility

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enhanced resolver configuration for New Architecture
config.resolver = {
  ...config.resolver,
  // Add node polyfills
  extraNodeModules: {
    ...(config.resolver.extraNodeModules || {}),
    assert: require.resolve('assert'),
  },
  // Ensure source extensions include all necessary file types
  sourceExts: [...(config.resolver.sourceExts || []), 'cjs'],
  // Use unstable_enablePackageExports for better module resolution
  unstable_enablePackageExports: true,
};

// Transformer configuration for better Hermes compatibility
config.transformer = {
  ...config.transformer,
  // Enable Hermes for all platforms
  hermesParser: true,
  minifierConfig: {
    keep_fnames: true, // Preserve function names for better debugging
  },
  // Ensure proper handling of global variables
  asyncRequireModulePath: require.resolve('metro-runtime/src/modules/asyncRequire'),
};

module.exports = config;