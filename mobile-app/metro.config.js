const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');
const fs = require('fs');

// Find the workspace root
const workspaceRoot = path.resolve(__dirname, '../');
const projectRoot = __dirname;

// Create watchFolders including all workspace packages
const watchFolders = [
  workspaceRoot,
  // Include backend shared types if needed
  path.resolve(workspaceRoot, 'backend/shared'),
];

const config = {
  projectRoot,
  watchFolders,
  
  resolver: {
    // Ensure metro can resolve modules from workspace root
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(workspaceRoot, 'node_modules'),
    ],
    
    // Handle symlinks properly
    unstable_enableSymlinks: true,
    
    // Blocklist to avoid duplicate react-native
    blockList: [
      // Block backend-specific paths
      /\/backend\/api\/.*/,
      /\/backend\/admin\/.*/,
      /\/database\/.*/,
      /\/infrastructure\/.*/,
      // Block build artifacts
      /.*\/build\/.*/,
      /.*\/dist\/.*/,
      // Block iOS build artifacts
      /.*\/ios\/build\/.*/,
      /.*\/ios\/Pods\/.*/,
      // Block Android build artifacts
      /.*\/android\/\.gradle\/.*/,
      /.*\/android\/build\/.*/,
      /.*\/android\/app\/build\/.*/,
    ],
    
    // Extra node modules for monorepo
    extraNodeModules: new Proxy(
      {},
      {
        get: (target, name) => {
          if (name === 'react-native') {
            return path.join(workspaceRoot, 'node_modules', name);
          }
          // First try to resolve from project root
          const projectModule = path.join(projectRoot, 'node_modules', name);
          if (fs.existsSync(projectModule)) {
            return projectModule;
          }
          // Then try workspace root
          return path.join(workspaceRoot, 'node_modules', name);
        },
      },
    ),
    
    // Asset extensions
    assetExts: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'ttf', 'otf', 'woff', 'woff2'],
  },
  
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
    
    // Ensure proper babel config
    babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
  },
  
  // Server configuration
  server: {
    enhanceMiddleware: (middleware) => {
      return (req, res, next) => {
        // Handle monorepo paths
        if (req.url.startsWith('/node_modules/')) {
          req.url = req.url.replace('/node_modules/', '/../node_modules/');
        }
        return middleware(req, res, next);
      };
    },
  },
  
  // Reset cache on start (can be removed after setup is stable)
  resetCache: true,
  
  // Maximum workers for bundling
  maxWorkers: 4,
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);