#!/bin/bash

# Quick Metro Bundler Fix
echo "🔧 Fixing Metro Bundler issues..."

# Kill all node processes
echo "Killing existing Node processes..."
pkill -f node || true
pkill -f "react-native" || true

# Clear all caches
echo "Clearing Metro and React Native caches..."
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*
rm -rf node_modules/.cache

# Clear watchman
watchman watch-del-all 2>/dev/null || true

# Reset Metro bundler
cd "$(dirname "$0")/.."
npx react-native start --reset-cache &

echo "✅ Metro bundler restarted with clean cache!"
echo "You can now run 'npm run ios' or 'npm run android' in another terminal"