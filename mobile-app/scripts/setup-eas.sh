#!/bin/bash

echo "🚀 MindfulMeals EAS Setup Script"
echo "================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo -e "${YELLOW}EAS CLI not found. Installing...${NC}"
    npm install -g eas-cli
fi

echo -e "${GREEN}✓ EAS CLI is installed${NC}"

# Check if logged in
if ! eas whoami &> /dev/null; then
    echo -e "${YELLOW}Not logged in to EAS. Please login:${NC}"
    eas login
fi

echo -e "${GREEN}✓ Logged in to EAS${NC}"

# Verify project info
echo -e "\n${YELLOW}Project Information:${NC}"
eas project:info

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "\n${YELLOW}Creating .env file from template...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env file${NC}"
    echo -e "${YELLOW}Please update .env with your actual values${NC}"
fi

# Install dependencies
echo -e "\n${YELLOW}Installing dependencies...${NC}"
npm install

# Offer to create development build
echo -e "\n${GREEN}Setup complete!${NC}"
echo -e "\nAvailable commands:"
echo "  npm run eas:build:dev      - Build development version"
echo "  npm run eas:build:preview  - Build preview version"
echo "  npm run eas:build:prod     - Build production version"
echo "  npm run eas:build:debug    - Build debug version locally"
echo ""
echo "For more information, see EAS_SETUP_GUIDE.md"

# Ask if user wants to start a build
read -p "Would you like to start a development build now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run eas:build:dev
fi