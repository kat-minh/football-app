import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  testGeminiModels,
  getBestAvailableModel,
} from "../utils/geminiModelTest";
import aiFootballService from "../services/aiFootballService";

export default function AIDebugScreen() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  const testModels = async () => {
    setIsLoading(true);
    setLogs([]);
    addLog("🔍 Testing Gemini models...");

    try {
      // Capture console.log output
      const originalLog = console.log;
      console.log = (message: string) => {
        addLog(message);
        originalLog(message);
      };

      await testGeminiModels();

      // Restore console.log
      console.log = originalLog;
    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testBestModel = async () => {
    setIsLoading(true);
    addLog("🎯 Finding best available model...");

    try {
      const bestModel = await getBestAvailableModel();
      addLog(`✅ Best model: ${bestModel}`);
    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testService = async () => {
    setIsLoading(true);
    addLog("🤖 Testing AI Football Service...");

    try {
      await aiFootballService.ensureInitialized();
      addLog("✅ Service initialized successfully");

      const response = await aiFootballService.generateResponse(
        "Hello, just respond with OK"
      );
      addLog(`✅ Service response: ${response.substring(0, 100)}...`);
    } catch (error: any) {
      addLog(`❌ Service error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4">
        <Text className="text-2xl font-bold mb-4">AI Debug Console</Text>

        <View className="flex-row flex-wrap gap-2 mb-4">
          <TouchableOpacity
            onPress={testModels}
            disabled={isLoading}
            className="bg-blue-500 px-4 py-2 rounded"
          >
            <Text className="text-white">Test Models</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={testBestModel}
            disabled={isLoading}
            className="bg-green-500 px-4 py-2 rounded"
          >
            <Text className="text-white">Best Model</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={testService}
            disabled={isLoading}
            className="bg-purple-500 px-4 py-2 rounded"
          >
            <Text className="text-white">Test Service</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={clearLogs}
            className="bg-gray-500 px-4 py-2 rounded"
          >
            <Text className="text-white">Clear</Text>
          </TouchableOpacity>
        </View>

        {isLoading && (
          <View className="bg-yellow-100 p-3 rounded mb-4">
            <Text className="text-yellow-800">⏳ Loading...</Text>
          </View>
        )}

        <ScrollView className="flex-1 bg-gray-100 p-3 rounded">
          {logs.length === 0 ? (
            <Text className="text-gray-500 italic">
              No logs yet. Click a button to start testing.
            </Text>
          ) : (
            logs.map((log, index) => (
              <Text key={index} className="text-sm mb-1 font-mono">
                {log}
              </Text>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
