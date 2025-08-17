#!/bin/bash

# Dependency Doctor - Diagnose and fix dependency issues
set -e

echo "🔍 Dependency Doctor - Analyzing project dependencies..."
echo "=================================================="

cd "$(dirname "$0")/.."

# Check for conflicting dependencies
echo -e "\n📊 Checking for duplicate dependencies..."
npm ls --depth=0 2>&1 | grep -E "UNMET|deduped|invalid" || echo "✅ No obvious duplicates found"

# Check peer dependency issues
echo -e "\n📊 Checking peer dependencies..."
npm ls 2>&1 | grep -E "peer dep|ERESOLVE" || echo "✅ No peer dependency conflicts"

# Check React Native version alignment
echo -e "\n📊 Checking React Native version alignment..."
RN_VERSION=$(node -p "require('./package.json').dependencies['react-native']")
echo "React Native version: $RN_VERSION"

# Common fixes
echo -e "\n💊 Applying common fixes..."

# Fix 1: Clear npm cache
echo "1. Clearing npm cache..."
npm cache clean --force

# Fix 2: Remove problematic lock file
echo "2. Removing package-lock.json for fresh install..."
rm -f package-lock.json

# Fix 3: Install with legacy peer deps
echo "3. Installing with legacy peer deps..."
npm install --legacy-peer-deps

# Fix 4: Deduplicate dependencies
echo "4. Deduplicating dependencies..."
npm dedupe

# Fix 5: Audit and fix vulnerabilities
echo "5. Running security audit..."
npm audit fix --force || true

echo -e "\n✅ Dependency doctor complete!"
echo -e "\n📋 Recommendations:"
echo "1. If issues persist, try: rm -rf node_modules && npm install --legacy-peer-deps"
echo "2. For stubborn conflicts, manually update package.json versions"
echo "3. Consider using npm-check-updates: npx npm-check-updates -u"