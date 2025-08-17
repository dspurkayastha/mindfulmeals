module.exports = {
  project: {
    ios: {},
    android: {},
  },
  dependencies: {
    // Disable autolinking for packages that cause issues in monorepo
    // Example:
    // 'react-native-flipper': {
    //   platforms: {
    //     ios: null,
    //     android: null,
    //   },
    // },
  },
  // Asset configuration
  assets: ['./src/assets/fonts/'],
};