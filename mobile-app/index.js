// Simple logging to debug require issue
console.log('=== INDEX.JS START ===');
console.log('typeof require:', typeof require);
console.log('typeof global:', typeof global);
console.log('typeof global.require:', typeof global?.require);
console.log('typeof global.__r:', typeof global?.__r);

// Early polyfills for React Native New Architecture
// Must be the very first code executed

// Polyfill global if it doesn't exist
if (typeof global === 'undefined') {
  console.log('Creating global from window');
  window.global = window;
}

// Ensure process.env exists
if (typeof process === 'undefined') {
  console.log('Creating process.env');
  global.process = { env: { NODE_ENV: 'development' } };
}

// Polyfill for __DEV__
if (typeof global.__DEV__ === 'undefined') {
  global.__DEV__ = process.env.NODE_ENV !== 'production';
}

// Fix for require not being available in some environments
if (typeof global.require === 'undefined') {
  console.log('Fixing global.require');
  // Try to use Metro's internal require
  if (typeof global.__r !== 'undefined') {
    console.log('Using global.__r for require');
    global.require = global.__r;
  } else if (typeof global.__metro_require__ !== 'undefined') {
    console.log('Using global.__metro_require__ for require');
    global.require = global.__metro_require__;
  } else if (typeof require !== 'undefined') {
    console.log('Using existing require');
    global.require = require;
  } else {
    console.log('WARNING: No require function found!');
  }
}

console.log('After polyfills - typeof require:', typeof require);
console.log('After polyfills - typeof global.require:', typeof global.require);

try {
  // Import order is important here
  console.log('Importing InitializeCore...');
  import 'react-native/Libraries/Core/InitializeCore';
  console.log('InitializeCore imported successfully');
} catch (error) {
  console.error('Error importing InitializeCore:', error);
}

try {
  console.log('Importing expo-dev-client...');
  import 'expo-dev-client';
  console.log('expo-dev-client imported successfully');
} catch (error) {
  console.error('Error importing expo-dev-client:', error);
}

try {
  console.log('Importing react-native-gesture-handler...');
  import 'react-native-gesture-handler';
  console.log('react-native-gesture-handler imported successfully');
} catch (error) {
  console.error('Error importing react-native-gesture-handler:', error);
}

console.log('Importing Expo modules...');
import { registerRootComponent } from 'expo';

// Import App after all polyfills are set up
console.log('Importing App...');
import App from './App';

console.log('Registering root component...');
// Register the app
registerRootComponent(App);

console.log('=== INDEX.JS END ===');