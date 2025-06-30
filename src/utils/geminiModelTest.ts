import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config/appConfig";

/**
 * Test different Gemini models to find which ones are available
 * This helps debug model availability issues
 */
export async function testGeminiModels() {
  if (!config.GEMINI_API_KEY || config.GEMINI_API_KEY === "") {
    console.log("❌ No API key configured");
    return;
  }

  const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
  const modelsToTest = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-pro",
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro-latest",
  ];

  console.log("🔍 Testing available Gemini models...");

  for (const modelName of modelsToTest) {
    try {
      console.log(`Testing ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });

      const result = await model.generateContent(
        "Hello, respond with just 'OK'"
      );
      const response = await result.response;
      const text = response.text();

      if (text) {
        console.log(
          `✅ ${modelName}: Working (Response: ${text.substring(0, 20)}...)`
        );
      } else {
        console.log(`⚠️  ${modelName}: No response text`);
      }
    } catch (error: any) {
      if (error.message?.includes("404")) {
        console.log(`❌ ${modelName}: Not found (404)`);
      } else if (error.message?.includes("403")) {
        console.log(`❌ ${modelName}: Access denied (403)`);
      } else {
        console.log(
          `❌ ${modelName}: Error - ${error.message?.substring(0, 50)}...`
        );
      }
    }
  }
}

/**
 * Get the best available model for the current API key
 */
export async function getBestAvailableModel(): Promise<string> {
  const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
  const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      // Test with a simple prompt
      await model.generateContent("Test");
      return modelName;
    } catch (error) {
      console.log(`Model ${modelName} not available, trying next...`);
      continue;
    }
  }

  throw new Error(
    "No available Gemini models found. Please check your API key and try again."
  );
}

// For debugging in development
if (__DEV__) {
  // Uncomment to test models on app start
  // testGeminiModels();
}
