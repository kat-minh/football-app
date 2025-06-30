import React, { useCallback, useEffect, useState } from "react";
import {
  useRoute,
  RouteProp,
  useNavigation,
  NavigationProp,
} from "@react-navigation/native";
import {
  RefreshControl,
  ScrollView,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HomeStackParamList } from "../navigation/HomeStack";
import { usePlayerStore } from "../store/playerStore";
import { Feedback } from "../types/player";
import { Card, CardContent, CardHeader } from "../components/ui/card";

type DetailScreenRouteProp = RouteProp<HomeStackParamList, "Detail">;
const { width } = Dimensions.get("window");

const DetailScreen = () => {
  const route = useRoute<DetailScreenRouteProp>();
  const navigation = useNavigation<NavigationProp<any>>();
  const { players, fetchPlayerById, player, setPlayer } = usePlayerStore();
  const [refreshing, setRefreshing] = useState(false);

  const playerId = route.params?.id;

  // ✅ ĐÚNG - Sử dụng useEffect thay vì useMemo
  useEffect(() => {
    if (player?.id === playerId) {
      return; // Player đã đúng, không cần làm gì
    }

    const foundPlayer = players.find((p) => p.id === playerId);
    setPlayer(foundPlayer ?? null);
  }, [playerId, players, player?.id, setPlayer]);

  // ✅ ĐÚNG - currentPlayer chỉ đọc, không gọi setState
  const currentPlayer =
    player?.id === playerId ? player : players.find((p) => p.id === playerId);

  useEffect(() => {
    return () => {
      setPlayer(null);
    };
  }, [setPlayer]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (playerId) {
      await fetchPlayerById(playerId);
    }
    setRefreshing(false);
  }, [playerId, fetchPlayerById]);

  if (!currentPlayer) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-gray-600 text-lg">Không tìm thấy cầu thủ</Text>
      </View>
    );
  }

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

  const averageRating =
    currentPlayer.feedbacks.length > 0
      ? (
          currentPlayer.feedbacks.reduce(
            (acc: number, f: Feedback) => acc + f.rating,
            0
          ) / currentPlayer.feedbacks.length
        ).toFixed(1)
      : "N/A";

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header with Player Image */}
      <View className="relative">
        <Image
          source={{
            uri: currentPlayer.image || "https://via.placeholder.com/400",
          }}
          style={{ width: width, height: 300 }}
          className="bg-gray-200"
          resizeMode="cover"
        />

        {/* Gradient Overlay */}
        <View className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Captain Badge */}
        {currentPlayer.isCaptain && (
          <View className="absolute top-12 right-4 bg-yellow-400 px-3 py-2 rounded-full">
            <Text className="text-black font-bold">Đội trưởng</Text>
          </View>
        )}

        {/* Player Basic Info */}
        <View className="absolute bottom-6 left-6 right-6">
          <View className="flex-row items-center mb-2">
            <View
              className={`px-3 py-1 rounded-full ${getPositionColor(
                currentPlayer.position
              )} mr-3`}
            >
              <Text className="text-white font-bold text-sm">
                {currentPlayer.position}
              </Text>
            </View>
            <Text className="text-white text-sm bg-black/30 px-2 py-1 rounded">
              {currentPlayer.team}
            </Text>
          </View>

          <Text className="text-white text-3xl font-bold mb-1">
            {currentPlayer.playerName}
          </Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View className="px-6 py-6">
        <View className="flex-row justify-between mb-6">
          <Card className="flex-1 mr-2 bg-blue-50 border-blue-200">
            <CardContent className="items-center py-4">
              <Text className="text-2xl font-bold text-blue-600">
                {currentPlayer.MinutesPlayed}
              </Text>
              <Text className="text-blue-600 text-sm">Phút thi đấu</Text>
            </CardContent>
          </Card>

          <Card className="flex-1 mx-2 bg-green-50 border-green-200">
            <CardContent className="items-center py-4">
              <Text className="text-2xl font-bold text-green-600">
                {currentPlayer.PassingAccuracy}%
              </Text>
              <Text className="text-green-600 text-sm">Độ chính xác</Text>
            </CardContent>
          </Card>

          <Card className="flex-1 ml-2 bg-yellow-50 border-yellow-200">
            <CardContent className="items-center py-4">
              <Text className="text-2xl font-bold text-yellow-600">
                {averageRating}
              </Text>
              <Text className="text-yellow-600 text-sm">Đánh giá</Text>
            </CardContent>
          </Card>
        </View>

        {/* Player Information */}
        <Card className="mb-6">
          <CardHeader>
            <Text className="text-xl font-bold text-gray-900">
              Thông tin cầu thủ
            </Text>
          </CardHeader>
          <CardContent>
            <View className="space-y-4">
              <View className="flex-row justify-between py-3 border-b border-gray-100">
                <Text className="text-gray-600">Tên cầu thủ</Text>
                <Text className="font-semibold text-gray-900">
                  {currentPlayer.playerName}
                </Text>
              </View>

              <View className="flex-row justify-between py-3 border-b border-gray-100">
                <Text className="text-gray-600">Năm sinh</Text>
                <Text className="font-semibold text-gray-900">
                  {currentPlayer.YoB}
                </Text>
              </View>

              <View className="flex-row justify-between py-3 border-b border-gray-100">
                <Text className="text-gray-600">Vị trí</Text>
                <Text className="font-semibold text-gray-900">
                  {currentPlayer.position}
                </Text>
              </View>

              <View className="flex-row justify-between py-3 border-b border-gray-100">
                <Text className="text-gray-600">Đội bóng</Text>
                <Text className="font-semibold text-gray-900">
                  {currentPlayer.team}
                </Text>
              </View>

              <View className="flex-row justify-between py-3">
                <Text className="text-gray-600">Vai trò</Text>
                <Text className="font-semibold text-gray-900">
                  {currentPlayer.isCaptain ? "Đội trưởng" : "Cầu thủ"}
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* AI Features Section */}
        <Card className="mb-6">
          <CardHeader>
            <Text className="text-xl font-bold text-gray-900">
              🤖 Tính năng AI
            </Text>
          </CardHeader>
          <CardContent>
            <View className="space-y-3">
              {/* AI Chat Button */}
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("AIAnalysis", { player: currentPlayer })
                }
                className="flex-row items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200"
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center mr-3">
                    <Ionicons name="chatbubbles" size={20} color="#fff" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-blue-900">
                      Chat với AI về {currentPlayer.playerName}
                    </Text>
                    <Text className="text-blue-600 text-sm">
                      Hỏi AI về cầu thủ này
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#3b82f6" />
              </TouchableOpacity>
            </View>
          </CardContent>
        </Card>

        {/* Feedbacks Section */}
        {currentPlayer.feedbacks.length > 0 && (
          <>
            {/* Rating Overview */}
            <Card className="mb-4">
              <CardHeader>
                <Text className="text-xl font-bold text-gray-900">
                  Tổng quan đánh giá
                </Text>
              </CardHeader>
              <CardContent>
                <View className="flex-row items-center justify-between mb-4">
                  <View className="items-center">
                    <Text className="text-3xl font-bold text-yellow-500">
                      {averageRating}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Text
                          key={star}
                          className={`text-lg ${
                            star <= Math.round(parseFloat(averageRating) || 0)
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </Text>
                      ))}
                    </View>
                    <Text className="text-gray-600 text-sm mt-1">
                      {currentPlayer.feedbacks.length} đánh giá
                    </Text>
                  </View>

                  {/* Rating Distribution */}
                  <View className="flex-1 ml-6">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = currentPlayer.feedbacks.filter(
                        (f) => f.rating === rating
                      ).length;
                      const percentage =
                        (count / currentPlayer.feedbacks.length) * 100;

                      return (
                        <View
                          key={rating}
                          className="flex-row items-center mb-1"
                        >
                          <Text className="text-sm text-gray-600 w-8">
                            {rating}★
                          </Text>
                          <View className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                            <View
                              className="bg-yellow-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </View>
                          <Text className="text-sm text-gray-600 w-8">
                            {count}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </CardContent>
            </Card>

            {/* Feedbacks Grouped by Rating */}
            <Card>
              <CardHeader>
                <Text className="text-xl font-bold text-gray-900">
                  Chi tiết đánh giá
                </Text>
              </CardHeader>
              <CardContent>
                {[5, 4, 3, 2, 1].map((ratingGroup) => {
                  const feedbacksInGroup = currentPlayer.feedbacks.filter(
                    (f) => f.rating === ratingGroup
                  );

                  if (feedbacksInGroup.length === 0) return null;

                  return (
                    <View key={ratingGroup} className="mb-6">
                      {/* Rating Group Header */}
                      <View className="flex-row items-center mb-3 pb-2 border-b border-gray-200">
                        <View className="flex-row items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Text
                              key={star}
                              className={`text-base ${
                                star <= ratingGroup
                                  ? "text-yellow-500"
                                  : "text-gray-300"
                              }`}
                            >
                              ★
                            </Text>
                          ))}
                        </View>
                        <Text className="ml-2 font-semibold text-gray-900">
                          ({feedbacksInGroup.length} đánh giá)
                        </Text>
                      </View>

                      {/* Feedbacks in this rating group */}
                      {feedbacksInGroup.map((feedback, index) => (
                        <View
                          key={`${ratingGroup}-${index}`}
                          className="mb-4 p-4 bg-gray-50 rounded-lg"
                        >
                          <View className="flex-row justify-between items-start mb-2">
                            <Text className="font-semibold text-gray-900">
                              {feedback.author}
                            </Text>
                            <Text className="text-gray-400 text-sm">
                              {new Date(feedback.date).toLocaleDateString(
                                "vi-VN"
                              )}
                            </Text>
                          </View>

                          <Text className="text-gray-700 leading-relaxed">
                            {feedback.comment}
                          </Text>
                        </View>
                      ))}
                    </View>
                  );
                })}
              </CardContent>
            </Card>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default DetailScreen;
