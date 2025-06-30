# ⚽ Football Player Management App

A modern React Native (Expo) application for managing football players with advanced AI features, interactive maps, and image analysis capabilities.

## 🌟 Features

### Core Features

- 👥 **Player Management**: Browse, search, and manage football players
- ❤️ **Favorites System**: Add/remove players to favorites with persistent storage
- 🔍 **Advanced Search**: Real-time search by player name, team, or position
- 📊 **Player Statistics**: Detailed player information and performance stats
- ⭐ **Rating System**: View player ratings and feedback

### 🤖 Advanced AI Features

- **AI Chat Assistant**: Football-focused AI that only answers football-related questions
- **Player Analysis**: Get detailed AI-powered analysis of specific players
- **Image Analysis**: Upload or take photos for AI analysis of player performance
- **Context-Aware Conversations**: AI remembers player context during detailed discussions
- **Plain Text Responses**: Clean, readable responses without markdown formatting
- **Multilingual Support**: Responses in Vietnamese for local users

### 📱 Navigation & UI

- **Home Screen**: Player listing + AI Chat & Map quick access
- **Favorites Screen**: Favorite players + AI Chat & Map quick access
- **Detail Screen**: Player details + AI Chat (contextual to selected player)
- **AI Chat Screen**: Full-featured chat with image upload capability
- **Stadium Map**: Interactive map of Vietnamese football stadiums

### Key Improvements

- 🎯 **Football-Only AI**: AI strictly responds to football topics only
- 📝 **Clean Text Format**: No markdown, clean readable responses
- 📷 **Integrated Image Upload**: Camera/gallery access directly in chat
- 🏠 **Simplified Navigation**: Streamlined quick access from main screens
- 🔒 **Secure API Management**: Environment-based API key management

### 🗺️ Location & Mapping

- **Interactive Stadium Map**: View Vietnamese football stadiums on interactive map
- **GPS Location**: Find your current location
- **Nearby Stadiums**: Discover stadiums within 50km radius
- **Stadium Information**: Detailed stadium data including capacity and team info

### 📷 Image Features

- **Camera Integration**: Take photos directly from camera
- **Gallery Access**: Pick images from device gallery
- **Image Processing**: Automatic image optimization and base64 conversion
- **AI Image Analysis**: Get AI insights from player photos

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI
- Android Studio (for Android) or Xcode (for iOS)

### Installation

1. **Clone the repository**

   ```bash
   git clone [your-repo-url]
   cd assignment_mma
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   # Windows
   setup-env.bat

   # macOS/Linux
   chmod +x setup-env.sh
   ./setup-env.sh
   ```

   Or manually:

   ```bash
   cp .env.example .env
   # Edit .env file with your Gemini API key
   ```

4. **Get Gemini AI API Key**

   - Go to [Google AI Studio](https://aistudio.google.com/)
   - Sign in with your Google account
   - Create a new API key
   - Add it to your `.env` file

5. **Start the development server**

   ```bash
   npm start
   ```

6. **Run on device**
   - Install Expo Go app on your phone
   - Scan QR code from terminal
   - Or press 'a' for Android emulator, 'i' for iOS simulator

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Required: Gemini AI API Key
EXPO_PUBLIC_GEMINI_API_KEY=your_api_key_here

# Optional: Backend URL (current MockAPI works)
EXPO_PUBLIC_BACKEND_URL=https://6772048bee76b92dd490f044.mockapi.io/api/v1

# App Configuration
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_DEBUG_MODE=true
```

### API Keys Required

- **Gemini AI API Key**: For AI features (player analysis, chat, image analysis)
- **Google Maps API Key**: Already configured for map features

## 📱 App Structure

```
src/
├── screens/              # App screens
│   ├── HomeScreen.tsx    # Main player listing
│   ├── DetailScreen.tsx  # Player details
│   ├── FavoritesScreen.tsx # Favorite players
│   ├── AIAnalysisScreen.tsx # AI chat interface
│   └── StadiumMapScreen.tsx # Interactive map
├── services/             # Business logic
│   ├── geminiAI.ts      # AI service integration
│   ├── imagePickerService.ts # Image handling
│   ├── locationService.ts # Location & mapping
│   └── playerService.ts  # Player data management
├── components/           # Reusable UI components
├── navigation/           # App navigation
├── store/               # State management (Zustand)
├── types/               # TypeScript definitions
└── config/              # App configuration
```

## 🎮 How to Use

### Basic Navigation

1. **Home Tab**: Browse all players, use AI features
2. **Favorites Tab**: View your favorite players
3. **Detail Screen**: View player details, access AI analysis

### AI Features

1. **AI Chat from Home/Favorites**:

   - Tap "AI Chat" button on Home or Favorites screen
   - General football chat with topic restriction
   - Image upload available via camera button in chat

2. **AI Chat from Player Detail**:

   - Tap "AI Chat" button on player detail screen
   - Contextual chat about specific player
   - AI knows which player you're discussing

3. **Image Analysis**:

   - Use camera button in chat to take photo or select from gallery
   - AI analyzes player images and provides insights
   - Results displayed directly in chat conversation

4. **Stadium Map**:
   - Tap "Bản đồ" button to view interactive map
   - See Vietnamese football stadiums
   - Get directions and stadium information

### AI Behavior

- **Football Topics Only**: AI only responds to football-related questions
- **Polite Rejection**: Non-football questions are politely declined
- **Clean Text**: Responses are in plain text format (no markdown)
- **Vietnamese Language**: All responses in Vietnamese
- **Context Awareness**: Remembers player context when chatting from detail screen

### Map Features

1. **Stadium Map**:
   - Tap "Bản đồ" from any screen
   - Grant location permission
   - View nearby stadiums on interactive map
   - Tap markers for stadium details

### Player Management

1. **Search Players**: Use search bar on Home/Favorites
2. **Add to Favorites**: Tap heart icon on any player card
3. **View Details**: Tap on player card to see full details
4. **Remove from Favorites**: Tap heart icon again or use bulk actions

## 🛠️ Development

### Key Technologies

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **TypeScript**: Type-safe development
- **Zustand**: State management
- **React Navigation**: App navigation
- **Google Generative AI**: AI capabilities
- **React Native Maps**: Map integration
- **Expo Image Picker**: Camera and gallery access

### Project Scripts

```bash
npm start          # Start Expo development server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on web
```

### Development Tips

1. **Hot Reload**: Code changes reflect immediately
2. **Debug Mode**: Shake device to open debug menu
3. **Environment**: Check `EXPO_PUBLIC_DEBUG_MODE` in .env
4. **API Testing**: Use Expo DevTools for network inspection

## 📚 Documentation

- [Advanced Features Guide](ADVANCED_FEATURES.md) - Detailed feature documentation
- [Environment Setup Guide](ENVIRONMENT_SETUP.md) - Environment configuration
- [Usage Examples](src/examples/advancedFeaturesExample.ts) - Code examples

## 🔒 Security

- ✅ API keys stored in environment variables
- ✅ Sensitive files in .gitignore
- ✅ Permission handling for camera/location
- ✅ Input validation and error handling

## 🐛 Troubleshooting

### Common Issues

1. **AI Features Not Working**

   - Check if `EXPO_PUBLIC_GEMINI_API_KEY` is set in .env
   - Verify API key is valid at Google AI Studio
   - Restart development server after .env changes

2. **Map Not Loading**

   - Grant location permission when prompted
   - Check internet connection
   - Ensure GPS is enabled on device

3. **Camera/Gallery Issues**

   - Grant camera and media library permissions
   - Try restarting the app
   - Check device camera functionality

4. **Build Failures**
   - Clear cache: `expo start -c`
   - Delete node_modules: `rm -rf node_modules && npm install`
   - Check for TypeScript errors

### Getting Help

- Check console logs for error messages
- Use Expo DevTools for debugging
- Verify all permissions are granted
- Ensure environment variables are set correctly

## 🚀 Deployment

### Building for Production

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure build
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

### Environment Variables for Production

Set production environment variables in `eas.json` or your deployment platform.

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Made with ❤️ using React Native & Expo**

For more detailed information about advanced features, check [ADVANCED_FEATURES.md](ADVANCED_FEATURES.md)
