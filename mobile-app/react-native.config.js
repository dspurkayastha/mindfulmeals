module.exports = {
  project: {
    ios: {
      sourceDir: './ios',
    },
    android: {
      sourceDir: './android',
    },
  },
  dependencies: {
    // Ensure proper linking for voice module
    '@react-native-voice/voice': {
      platforms: {
        ios: {
          scriptPhase: {
            name: 'Copy Voice Resources',
            script: 'cp -R "${BUILT_PRODUCTS_DIR}/${PRODUCT_NAME}.app" "${TARGET_BUILD_DIR}/${PRODUCT_NAME}.app"',
            execution_position: 'after_compile',
          },
        },
      },
    },
  },
  // Add custom commands
  commands: [
    {
      name: 'fix-ios-require',
      description: 'Fix iOS require issues',
      func: () => {
        console.log('Fixing iOS module loading...');
        // This is just a placeholder - the actual fix is in our polyfills
      },
    },
  ],
};