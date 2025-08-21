// Metro configuration for Expo + RN 0.81
// Adds polyfill mapping for Node core 'assert' used by @ide/backoff

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver = config.resolver || {};
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  assert: require.resolve('assert'),
};

module.exports = config;