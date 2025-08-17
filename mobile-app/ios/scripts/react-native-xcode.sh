#!/bin/bash
# This script wraps the react-native-xcode.sh to handle monorepo paths

# Set up environment
export NODE_BINARY=${NODE_BINARY:-$(command -v node)}

# Debug logging
echo "NODE_BINARY: $NODE_BINARY"
echo "Current directory: $(pwd)"

# Set correct paths for monorepo
export REACT_NATIVE_PATH="../../../node_modules/react-native"

# Verify react-native path exists
if [ ! -d "$REACT_NATIVE_PATH" ]; then
    echo "error: React Native not found at $REACT_NATIVE_PATH"
    echo "Looking for react-native in alternative locations..."
    
    # Try to find react-native
    if [ -d "../node_modules/react-native" ]; then
        export REACT_NATIVE_PATH="../node_modules/react-native"
    elif [ -d "../../node_modules/react-native" ]; then
        export REACT_NATIVE_PATH="../../node_modules/react-native"
    elif [ -d "../../../node_modules/react-native" ]; then
        export REACT_NATIVE_PATH="../../../node_modules/react-native"
    else
        echo "error: Could not find react-native in any expected location"
        exit 1
    fi
fi

echo "Using React Native from: $REACT_NATIVE_PATH"

# Call the actual react-native-xcode.sh with correct paths
if [ -f "$REACT_NATIVE_PATH/scripts/react-native-xcode.sh" ]; then
    /bin/sh "$REACT_NATIVE_PATH/scripts/react-native-xcode.sh"
else
    echo "error: react-native-xcode.sh not found at $REACT_NATIVE_PATH/scripts/react-native-xcode.sh"
    exit 1
fi