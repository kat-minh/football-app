import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { Heart } from "lucide-react-native";
import { Player, Feedback } from "../types/player";
import { Card, CardContent, CardFooter } from "./ui/card";

interface PlayerCardProps {
  player: Player;
  onPress?: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
}

const { width } = Dimensions.get("window");
const cardWidth = (width - 58) / 2;

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  onPress,
  onFavoritePress,
  isFavorite = false,
}) => {
  const getPositionColor = (position: string) => {
    switch (position.toLowerCase()) {
      case "goalkeeper":
      case "gk":
        return "bg-yellow-500";
      case "defender":
      case "df":
        return "bg-blue-500";
      case "midfielder":
      case "mf":
        return "bg-green-500";
      case "forward":
      case "fw":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPositionAbbreviation = (position: string) => {
    switch (position.toLowerCase()) {
      case "goalkeeper":
        return "GK";
      case "defender":
        return "DF";
      case "midfielder":
        return "MF";
      case "forward":
        return "FW";
      default:
        return position.substring(0, 2).toUpperCase();
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="mb-4"
      style={{ width: cardWidth }}
    >
      <Card className="bg-white shadow-xl border-0 overflow-hidden rounded-2xl">
        <CardContent className="p-0">
          {/* Player Image */}
          <View className="relative">
            <Image
              source={{
                uri: player.image || "https://via.placeholder.com/150",
              }}
              className="w-full h-36 bg-gray-200"
              resizeMode="cover"
            />

            {/* Position Badge */}
            <View
              className={`absolute top-3 left-3 px-3 py-1 rounded-full shadow-lg ${getPositionColor(
                player.position
              )}`}
            >
              <Text className="text-white text-xs font-bold">
                {getPositionAbbreviation(player.position)}
              </Text>
            </View>

            {/* Captain Badge */}
            {player.isCaptain && (
              <View className="absolute top-3 left-16 bg-yellow-500 px-2 py-1 rounded-full shadow-lg">
                <Text className="text-white text-xs font-bold">C</Text>
              </View>
            )}

            {/* Favorite Button */}
            {onFavoritePress && (
              <TouchableOpacity
                onPress={onFavoritePress}
                className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
              >
                <Heart
                  size={16}
                  color={isFavorite ? "#ef4444" : "#6b7280"}
                  fill={isFavorite ? "#ef4444" : "transparent"}
                />
              </TouchableOpacity>
            )}

            {/* Gradient overlay */}
            <View
              className="absolute bottom-0 left-0 right-0 h-20"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.4)",
              }}
            />

            {/* Player Name Overlay */}
            <View className="absolute bottom-3 left-3 right-3">
              <Text
                className="text-white font-bold text-base mb-1"
                numberOfLines={1}
              >
                {player.playerName}
              </Text>
              <Text className="text-white text-sm opacity-90">
                {player.team}
              </Text>
            </View>
          </View>
        </CardContent>

        <CardFooter className="bg-indigo-50 px-4 py-3 mt-0 border-t-0">
          <View className="flex-row justify-between items-center w-full">
            <View className="flex-row items-center">
              <View className="bg-indigo-100 p-1 rounded-full mr-2">
                <Text className="text-indigo-600 text-xs font-medium">⚽</Text>
              </View>
              <Text className="text-gray-700 text-xs font-medium">
                Đánh giá
              </Text>
            </View>

            <View className="flex-row items-center bg-white px-2 py-1 rounded-full shadow-sm">
              <Text className="text-yellow-500 text-sm mr-1">★</Text>
              <Text className="text-gray-700 text-xs font-bold">
                {player.feedbacks.length > 0
                  ? (
                      player.feedbacks.reduce(
                        (acc: number, f: Feedback) => acc + f.rating,
                        0
                      ) / player.feedbacks.length
                    ).toFixed(1)
                  : "N/A"}
              </Text>
            </View>
          </View>
        </CardFooter>
      </Card>
    </TouchableOpacity>
  );
};
