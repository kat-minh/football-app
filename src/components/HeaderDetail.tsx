import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { Icon } from "./ui/icon";
import { ArrowLeft, Heart } from "lucide-react-native";
import { useFavoriteStore } from "../store/favoriteStore";
import { usePlayerStore } from "../store/playerStore";

export const HeaderDetail = ({ navigation }: NativeStackHeaderProps) => {
  const { isFavorite, toggleFavorite } = useFavoriteStore();
  const { player } = usePlayerStore();
  
  return (
    <View className="flex-row items-center justify-between px-5 py-3 bg-white border-b border-gray-200 shadow-sm">
      {/* Go Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="p-2 mr-2 active:opacity-70"
      >
        <ArrowLeft size={24} color="#374151" />
      </TouchableOpacity>

      {/* Title */}
      <Text
        className="flex-1 text-center text-lg font-bold text-gray-900"
        numberOfLines={1}
      >
        Chi tiết cầu thủ
      </Text>

      {/* Favorite Button */}
      <TouchableOpacity
        onPress={() => player && toggleFavorite(player)}
        className="p-2 ml-2 active:opacity-70"
      >
        <Heart
          size={24}
          color={player?.id && isFavorite(player.id) ? "#ef4444" : "#9ca3af"}
          fill={player?.id && isFavorite(player.id) ? "#ef4444" : "transparent"}
        />
      </TouchableOpacity>
    </View>
  );
};
