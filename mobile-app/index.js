// Polyfill for require in Hermes/Winter with New Architecture
// Some libraries expect global.require to exist
if (typeof global.require === 'undefined') {
  if (typeof global.__r !== 'undefined') {
    // Metro's internal require function
    global.require = global.__r;
  } else if (typeof require !== 'undefined') {
    // Fallback to the existing require if available
    global.require = require;
  } else {
    // Last resort: create a stub that throws a meaningful error
    global.require = function(moduleId) {
      throw new Error(`Cannot require module '${moduleId}' - require is not available in this environment`);
    };
  }
}

// Additional polyfill for module.exports pattern
if (typeof global.module === 'undefined') {
  global.module = { exports: {} };
}

// Ensure __DEV__ is defined
if (typeof global.__DEV__ === 'undefined') {
  global.__DEV__ = process.env.NODE_ENV !== 'production';
}

import 'expo-dev-client';
import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);