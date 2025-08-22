// Early polyfills for React Native New Architecture
// Must be the very first code executed
import './polyfills';

// Polyfill global if it doesn't exist
if (typeof global === 'undefined') {
  window.global = window;
}

// Ensure process.env exists
if (typeof process === 'undefined') {
  global.process = { env: { NODE_ENV: 'development' } };
}

// Polyfill for __DEV__
if (typeof global.__DEV__ === 'undefined') {
  global.__DEV__ = process.env.NODE_ENV !== 'production';
}

// Fix for require not being available in some environments
if (typeof global.require === 'undefined') {
  // Try to use Metro's internal require
  if (typeof global.__r !== 'undefined') {
    global.require = global.__r;
  } else if (typeof global.__metro_require__ !== 'undefined') {
    global.require = global.__metro_require__;
  } else if (typeof require !== 'undefined') {
    global.require = require;
  }
}

// Import order is important here
import 'react-native/Libraries/Core/InitializeCore';
import 'expo-dev-client';
import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';

// Import App after all polyfills are set up
import App from './App';

// Register the app
registerRootComponent(App);