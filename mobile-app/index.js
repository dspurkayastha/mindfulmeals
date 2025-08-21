// Ensure global.require exists for libraries expecting CommonJS in Hermes/Winter
if (typeof global.require === 'undefined' && global.__r) {
  // eslint-disable-next-line no-undef
  global.require = global.__r;
}

import 'expo-dev-client';
import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);