// Configuration file for API keys and settings
import Constants from "expo-constants";

// Validation function to ensure API key is provided
const validateConfig = () => {
  const apiKey =
    process.env.EXPO_PUBLIC_GEMINI_API_KEY ||
    Constants.expoConfig?.extra?.GEMINI_API_KEY;

  if (!apiKey || apiKey === "" || apiKey === "your_gemini_api_key_here") {
    console.warn("⚠️  GEMINI API KEY NOT CONFIGURED!");
    console.warn("📝 Please set EXPO_PUBLIC_GEMINI_API_KEY in your .env file");
    console.warn("🔗 Get your API key from: https://aistudio.google.com/");
  }

  return apiKey || "";
};

export const config = {
  // Gemini AI API Key - Get from environment variables only
  GEMINI_API_KEY: validateConfig(),

  // Backend URL
  BACKEND_URL: process.env.EXPO_PUBLIC_BACKEND_URL || "",

  // App Environment
  APP_ENV: process.env.EXPO_PUBLIC_APP_ENV || "development",
  DEBUG_MODE: process.env.EXPO_PUBLIC_DEBUG_MODE === "true",

  // Default settings
  DEFAULT_ANALYSIS_TEMPERATURE: 0.7,
  DEFAULT_CHAT_TEMPERATURE: 0.9,

  // Supported languages
  SUPPORTED_LANGUAGES: ["vi", "en"],

  // Map settings
  DEFAULT_MAP_RADIUS: 50, // km
  DEFAULT_MAP_ZOOM: 10,

  // Image settings
  DEFAULT_IMAGE_QUALITY: 0.8,
  MAX_IMAGE_SIZE: 1024 * 1024, // 1MB
};

// Export only default
export default config;
