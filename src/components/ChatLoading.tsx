import React from "react";
import { View, ActivityIndicator } from "react-native";

interface ChatLoadingProps {
  size?: "small" | "large";
  color?: string;
}

export const ChatLoading: React.FC<ChatLoadingProps> = ({
  size = "small",
  color = "#6B7280",
}) => {
  return (
    <View className="flex-row items-center justify-center">
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};
