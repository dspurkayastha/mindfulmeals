# App Assets

This directory contains all the visual assets for the MindfulMeals app.

## Required Assets

### App Icons
- **icon.png** - 1024x1024px square icon (will be automatically resized for different platforms)
- **adaptive-icon.png** - 1024x1024px for Android adaptive icons
- **favicon.png** - 48x48px for web

### Splash Screen
- **splash.png** - 1284x2778px (or similar aspect ratio) splash screen image

## Design Guidelines

Following the Duolingo-inspired design:
- Use bright, friendly, playful colors
- Large rounded corners
- Mascot/character elements for engagement
- Clear, simple iconography

## Asset Generation

You can use tools like:
- [Expo App Icon Generator](https://easyappicon.com/)
- [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/)
- [iOS App Icon Generator](https://appicon.co/)

## Placeholder Assets

For development, you can generate placeholder assets:
```bash
# Install jimp if not already installed
npm install -g jimp-cli

# Generate placeholder images (requires a script)
node scripts/generate-placeholder-assets.js
```

## Color Palette

Primary colors for MindfulMeals (Duolingo-inspired):
- Primary Green: #58CC02
- Secondary Blue: #1CB0F6
- Warning Orange: #FF9600
- Error Red: #FF4B4B
- Success Green: #58CC02
- Background Light: #FFFFFF
- Background Dark: #131F24
- Text Primary: #3C3C3C
- Text Secondary: #AFAFAF