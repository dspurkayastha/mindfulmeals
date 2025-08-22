// Metro configuration for Expo + RN 0.81 with New Architecture
// Fixes module resolution for iOS runtime

const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

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
  sourceExts: [...(config.resolver.sourceExts || []), 'cjs', 'mjs'],
  // Use unstable_enablePackageExports for better module resolution
  unstable_enablePackageExports: true,
  // Resolve main fields in package.json
  resolverMainFields: ['react-native', 'browser', 'module', 'main'],
  // Handle asset extensions
  assetExts: [...(config.resolver.assetExts || [])].filter(ext => ext !== 'svg'),
};

// Transformer configuration for better compatibility
config.transformer = {
  ...config.transformer,
  // Ensure babel transformer is used
  babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
  // Enable Hermes for all platforms
  hermesParser: true,
  minifierConfig: {
    keep_fnames: true, // Preserve function names for better debugging
    mangle: {
      keep_fnames: true,
    },
  },
  // Ensure proper handling of global variables
  asyncRequireModulePath: require.resolve('metro-runtime/src/modules/asyncRequire'),
  // Add global setup file
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

// Server configuration
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Add CORS headers for development
      res.setHeader('Access-Control-Allow-Origin', '*');
      return middleware(req, res, next);
    };
  },
};

// Serializer configuration
config.serializer = {
  ...config.serializer,
  getPolyfills: () => {
    return [require.resolve('./polyfills.js')];
  },
};

module.exports = config;