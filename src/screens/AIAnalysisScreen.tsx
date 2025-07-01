import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
  Keyboard,
  Image,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ArrowLeft,
  Send,
  Bot,
  User,
  MessageCircle,
  Activity,
  Target,
  Camera,
  Image as ImageIcon,
  X,
} from "lucide-react-native";
import { HomeStackParamList } from "../navigation/HomeStack";
import { Player } from "../types/player";
import aiFootballService, {
  ChatMessage,
  FootballContext,
} from "../services/aiFootballService";
import { imagePickerService } from "../services/imagePickerService";

type AIAnalysisScreenRouteProp = RouteProp<HomeStackParamList, "AIAnalysis">;
type AIAnalysisScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "AIAnalysis"
>;

const { width } = Dimensions.get("window");

export default function AIAnalysisScreen() {
  const navigation = useNavigation<AIAnalysisScreenNavigationProp>();
  const route = useRoute<AIAnalysisScreenRouteProp>();
  const { player } = route.params || {};

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isServiceReady, setIsServiceReady] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Initialize AI service
  useEffect(() => {
    // Hide tab bar when component mounts
    const parent = navigation.getParent();
    if (parent) {
      parent.setOptions({
        tabBarStyle: { display: "none" },
      });
    }

    // Show tab bar when component unmounts
    return () => {
      if (parent) {
        parent.setOptions({
          tabBarStyle: {
            backgroundColor: "#fefce8",
            borderTopWidth: 0,
            height: 80,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            paddingBottom: Platform.OS === "ios" ? 20 : 10,
            display: "flex",
            ...Platform.select({
              ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -3 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
              },
              android: {
                elevation: 8,
              },
            }),
          },
        });
      }
    };
  }, [navigation]);

  // Initialize AI service
  useEffect(() => {
    const initializeService = async () => {
      try {
        await aiFootballService.ensureInitialized();
        setIsServiceReady(true);

        // Add welcome message
        const welcomeMessage: ChatMessage = {
          id: Date.now().toString(),
          text: player
            ? `Xin chào! Tôi là AI Bot chuyên về bóng đá. Tôi thấy bạn đang quan tâm đến cầu thủ ${player.playerName}. Hãy hỏi tôi bất cứ điều gì về bóng đá, chiến thuật, cầu thủ, hoặc giải đấu nhé!`
            : "Xin chào! Tôi là AI Bot chuyên về bóng đá. Hãy hỏi tôi bất cứ điều gì về bóng đá, chiến thuật, cầu thủ, giải đấu, hay tin tức bóng đá mới nhất!",
          isUser: false,
          timestamp: new Date(),
        };

        setMessages([welcomeMessage]);
        aiFootballService.addToHistory(welcomeMessage);
      } catch (error: any) {
        console.error("Error initializing AI service:", error);
        Alert.alert(
          "Lỗi cấu hình",
          error.message ||
            "Không thể khởi tạo chatbot AI. Vui lòng kiểm tra cấu hình.",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      }
    };

    initializeService();
  }, [player, navigation]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Auto scroll when keyboard opens
  useEffect(() => {
    const keyboardShowListener =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const keyboardHideListener =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(
      keyboardShowListener,
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );

    const hideSubscription = Keyboard.addListener(keyboardHideListener, () => {
      setKeyboardHeight(0);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return () => {
      showSubscription?.remove();
      hideSubscription?.remove();
    };
  }, []);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    aiFootballService.addToHistory(userMessage);
    setInputText("");
    setIsLoading(true);
    scrollToBottom();

    try {
      const context: FootballContext = player
        ? {
            playerName: player.playerName,
            playerPosition: player.position,
            playerTeam: player.team,
          }
        : {};

      const aiResponse = await aiFootballService.generateResponse(
        inputText.trim(),
        context
      );

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      aiFootballService.addToHistory(aiMessage);
    } catch (error: any) {
      console.error("Error generating AI response:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text:
          error.message ||
          "Xin lỗi, tôi gặp sự cố khi xử lý câu hỏi của bạn. Vui lòng thử lại sau.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const analyzePlayer = async () => {
    if (!player || isLoading) return;

    setIsLoading(true);
    scrollToBottom();

    try {
      const analysis = await aiFootballService.analyzePlayer(player);

      const analysisMessage: ChatMessage = {
        id: Date.now().toString(),
        text: `📊 Phân tích cầu thủ ${player.playerName}:\n\n${analysis}`,
        isUser: false,
        timestamp: new Date(),
        type: "analysis",
      };

      setMessages((prev) => [...prev, analysisMessage]);
      aiFootballService.addToHistory(analysisMessage);
    } catch (error: any) {
      console.error("Error analyzing player:", error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        text: error.message || "Không thể phân tích cầu thủ. Vui lòng thử lại.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const suggestTactics = async () => {
    if (isLoading) return;

    setIsLoading(true);
    scrollToBottom();

    try {
      const tactics = await aiFootballService.suggestTactics("4-3-3");

      const tacticsMessage: ChatMessage = {
        id: Date.now().toString(),
        text: `⚽ Gợi ý chiến thuật 4-3-3:\n\n${tactics}`,
        isUser: false,
        timestamp: new Date(),
        type: "suggestion",
      };

      setMessages((prev) => [...prev, tacticsMessage]);
      aiFootballService.addToHistory(tacticsMessage);
    } catch (error: any) {
      console.error("Error suggesting tactics:", error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        text:
          error.message ||
          "Không thể đưa ra gợi ý chiến thuật. Vui lòng thử lại.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Image handling functions
  const handleImagePress = () => {
    setShowImageModal(true);
  };

  const handleTakePhoto = async () => {
    try {
      setShowImageModal(false);
      const result = await imagePickerService.takePhoto({
        quality: 0.7,
        base64: true,
      });

      if (result) {
        setSelectedImage(result.uri);
      }
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể chụp ảnh");
    }
  };

  const handlePickImage = async () => {
    try {
      setShowImageModal(false);
      const result = await imagePickerService.pickImageFromLibrary({
        quality: 0.7,
        base64: true,
      });

      if (result) {
        setSelectedImage(result.uri);
      }
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể chọn ảnh");
    }
  };

  const sendMessageWithImage = async () => {
    if ((!inputText.trim() && !selectedImage) || isLoading) return;

    const messageText = inputText.trim() || "📷 Hình ảnh được gửi";

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
      imageUri: selectedImage || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    aiFootballService.addToHistory(userMessage);
    setInputText("");
    setSelectedImage(null);
    setIsLoading(true);
    scrollToBottom();

    try {
      const context: FootballContext = player
        ? {
            playerName: player.playerName,
            playerPosition: player.position,
            playerTeam: player.team,
          }
        : {};

      // If there's an image, analyze it
      let analysisPrompt = inputText.trim();
      if (selectedImage && !analysisPrompt) {
        analysisPrompt =
          "Hãy phân tích hình ảnh này và cho tôi biết về bóng đá, cầu thủ, hoặc chiến thuật mà bạn thấy trong ảnh.";
      } else if (selectedImage) {
        analysisPrompt += " (Hình ảnh đã được gửi kèm)";
      }

      const aiResponse = await aiFootballService.generateResponse(
        analysisPrompt,
        context
      );

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      aiFootballService.addToHistory(aiMessage);
    } catch (error: any) {
      console.error("Error generating AI response:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text:
          error.message ||
          "Xin lỗi, tôi gặp sự cố khi xử lý câu hỏi của bạn. Vui lòng thử lại sau.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const renderMessage = (message: ChatMessage) => (
    <View
      key={message.id}
      className={`flex-row items-end mb-4 ${
        message.isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!message.isUser && (
        <View
          className={`rounded-full p-2 mr-2 ${
            message.type === "analysis"
              ? "bg-green-500"
              : message.type === "suggestion"
              ? "bg-purple-500"
              : "bg-blue-500"
          }`}
        >
          {message.type === "analysis" ? (
            <Activity size={16} color="white" />
          ) : message.type === "suggestion" ? (
            <Target size={16} color="white" />
          ) : (
            <Bot size={16} color="white" />
          )}
        </View>
      )}

      <View
        className={`max-w-[80%] rounded-2xl p-3 ${
          message.isUser
            ? "bg-blue-500 rounded-br-none"
            : message.type === "analysis"
            ? "bg-green-50 border border-green-200 rounded-bl-none"
            : message.type === "suggestion"
            ? "bg-purple-50 border border-purple-200 rounded-bl-none"
            : "bg-gray-100 rounded-bl-none"
        }`}
        style={{ maxWidth: width * 0.8 }}
      >
        {/* Display image if present */}
        {message.imageUri && (
          <Image
            source={{ uri: message.imageUri }}
            className="w-full h-40 rounded-xl mb-2"
            resizeMode="cover"
          />
        )}

        <Text
          className={`${
            message.isUser
              ? "text-white"
              : message.type === "analysis"
              ? "text-green-800"
              : message.type === "suggestion"
              ? "text-purple-800"
              : "text-gray-800"
          } text-base leading-5`}
        >
          {message.text}
        </Text>
        <Text
          className={`${
            message.isUser ? "text-blue-100" : "text-gray-500"
          } text-xs mt-1`}
        >
          {formatTime(message.timestamp)}
        </Text>
      </View>

      {message.isUser && (
        <View className="bg-blue-500 rounded-full p-2 ml-2">
          <User size={16} color="white" />
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: "white" }}>
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2 -ml-2"
          >
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>

          <View className="flex-1 flex-row items-center justify-center">
            <MessageCircle size={24} color="#3B82F6" />
            <Text className="text-lg font-semibold text-gray-800 ml-2">
              AI Football Chat
            </Text>
          </View>

          <View className="w-8" />
        </View>

        {player && (
          <View className="bg-blue-50 px-4 py-3 border-b border-blue-100">
            <Text className="text-sm text-blue-600">
              Đang thảo luận về:{" "}
              <Text className="font-semibold">{player.playerName}</Text>
            </Text>
            <Text className="text-xs text-blue-500">
              {player.position} • {player.team}
            </Text>
          </View>
        )}

        {/* Messages */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
          keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
        >
          <ScrollView
            ref={scrollViewRef}
            className="flex-1 px-4 py-4"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingBottom: Platform.OS === "android" ? 100 : 20,
            }}
          >
            {messages.map(renderMessage)}

            {isLoading && (
              <View className="flex-row items-center justify-start mb-4">
                <View className="bg-blue-500 rounded-full p-2 mr-2">
                  <Bot size={16} color="white" />
                </View>
                <View className="bg-gray-100 rounded-2xl rounded-bl-none p-3 flex-row items-center">
                  <ActivityIndicator size="small" color="#6B7280" />
                  <Text className="text-gray-500 text-sm ml-2">
                    Đang suy nghĩ...
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Quick Actions - Moved above input */}
          <View className="flex-row px-4 py-3 bg-white border-t border-gray-100 gap-3">
            {player && (
              <TouchableOpacity
                onPress={analyzePlayer}
                disabled={isLoading}
                className="flex-1 bg-green-500 rounded-lg py-2 px-3 flex-row items-center justify-center"
              >
                <Activity size={16} color="white" />
                <Text className="text-white text-sm font-medium ml-1">
                  Phân tích cầu thủ
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={suggestTactics}
              disabled={isLoading}
              className="flex-1 bg-purple-500 rounded-lg py-2 px-3 flex-row items-center justify-center"
            >
              <Target size={16} color="white" />
              <Text className="text-white text-sm font-medium ml-1">
                Gợi ý chiến thuật
              </Text>
            </TouchableOpacity>
          </View>

          {/* Input */}
          <View
            className="px-4 py-3 bg-gray-50 border-t border-gray-200"
            style={{
              marginBottom: keyboardHeight > 0 ? keyboardHeight : 0,
            }}
          >
            {/* Image Preview */}
            {selectedImage && (
              <View className="w-full mb-3 flex-row items-center">
                <View className="relative">
                  <Image
                    source={{ uri: selectedImage }}
                    className="w-20 h-20 rounded-xl"
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={() => setSelectedImage(null)}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                  >
                    <X size={12} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View className="flex-row items-end">
              {/* Camera Button */}
              <TouchableOpacity
                onPress={handleImagePress}
                disabled={isLoading}
                className="rounded-full p-3 mr-2 bg-gray-200"
              >
                <Camera size={20} color="#6b7280" />
              </TouchableOpacity>

              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Hỏi tôi về bóng đá hoặc gửi hình ảnh..."
                className="flex-1 bg-white rounded-full px-4 py-3 mr-3 border border-gray-200 min-h-[44px]"
                multiline
                maxLength={1000}
                onSubmitEditing={
                  selectedImage ? sendMessageWithImage : sendMessage
                }
                returnKeyType="send"
                blurOnSubmit={false}
                editable={!isLoading}
                textAlignVertical="center"
                onFocus={() => {
                  setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                  }, 100);
                }}
              />

              <TouchableOpacity
                onPress={selectedImage ? sendMessageWithImage : sendMessage}
                disabled={(!inputText.trim() && !selectedImage) || isLoading}
                className={`rounded-full p-3 ${
                  (inputText.trim() || selectedImage) && !isLoading
                    ? "bg-blue-500"
                    : "bg-gray-300"
                }`}
              >
                <Send size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Image Selection Modal */}
          <Modal
            visible={showImageModal}
            transparent
            animationType="slide"
            onRequestClose={() => setShowImageModal(false)}
          >
            <TouchableOpacity
              className="flex-1 bg-black/50 justify-end"
              activeOpacity={1}
              onPress={() => setShowImageModal(false)}
            >
              <TouchableOpacity
                className="bg-white rounded-t-3xl px-6 py-6"
                activeOpacity={1}
                onPress={(e) => e.stopPropagation()}
              >
                <View className="flex-row items-center justify-between mb-6">
                  <Text className="text-xl font-bold text-gray-900">
                    Chọn hình ảnh
                  </Text>
                  <TouchableOpacity onPress={() => setShowImageModal(false)}>
                    <X size={24} color="#6b7280" />
                  </TouchableOpacity>
                </View>

                <View className="flex-row justify-between space-x-4">
                  <TouchableOpacity
                    onPress={handleTakePhoto}
                    className="flex-1 bg-blue-500 p-6 rounded-2xl items-center"
                  >
                    <Camera size={32} color="white" />
                    <Text className="text-white font-bold mt-3 text-center">
                      Chụp ảnh
                    </Text>
                    <Text className="text-blue-100 text-sm text-center mt-1">
                      Sử dụng camera
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handlePickImage}
                    className="flex-1 bg-purple-500 p-6 rounded-2xl items-center"
                  >
                    <ImageIcon size={32} color="white" />
                    <Text className="text-white font-bold mt-3 text-center">
                      Chọn từ thư viện
                    </Text>
                    <Text className="text-purple-100 text-sm text-center mt-1">
                      Thư viện ảnh
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
