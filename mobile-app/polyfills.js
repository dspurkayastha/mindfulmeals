// Polyfills for React Native iOS with New Architecture
// This file is loaded before any other code

// Ensure global is available
if (typeof global === 'undefined') {
  global = typeof globalThis !== 'undefined' ? globalThis : 
          typeof window !== 'undefined' ? window : 
          typeof self !== 'undefined' ? self : {};
}

// Polyfill process
if (typeof process === 'undefined') {
  global.process = {
    env: { NODE_ENV: __DEV__ ? 'development' : 'production' },
    cwd: () => '/',
    nextTick: (fn) => setTimeout(fn, 0),
  };
}

// Ensure __DEV__ is available
if (typeof __DEV__ === 'undefined') {
  global.__DEV__ = process.env.NODE_ENV !== 'production';
}

// Polyfill require if needed
if (typeof require === 'undefined' && typeof global.require === 'undefined') {
  // Try various Metro internals
  const candidates = [
    global.__r,
    global.__metro_require__,
    global.metroRequire,
    global.$RefreshReg$,
  ];
  
  for (const candidate of candidates) {
    if (typeof candidate === 'function') {
      global.require = candidate;
      break;
    }
  }
}

// Polyfill module if needed
if (typeof module === 'undefined') {
  global.module = { exports: {} };
}

// Polyfill Buffer for libraries that expect it
if (typeof Buffer === 'undefined') {
  global.Buffer = {
    isBuffer: () => false,
    from: () => [],
    alloc: () => [],
  };
}

// Console polyfills
if (typeof console === 'undefined') {
  global.console = {
    log: () => {},
    warn: () => {},
    error: () => {},
    info: () => {},
    debug: () => {},
  };
}

// Performance polyfill
if (typeof performance === 'undefined') {
  global.performance = {
    now: () => Date.now(),
  };
}