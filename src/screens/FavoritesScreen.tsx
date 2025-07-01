import React, { useCallback, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  RefreshControl,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  FlatList,
  TextInput,
  Animated,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Swipeable,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { useFavoriteStore } from "../store/favoriteStore";
import { usePlayerStore } from "../store/playerStore";
import { Player, Feedback } from "../types/player";
import { Icon } from "../components/ui/icon";
import {
  Heart,
  Trash2,
  CheckSquare,
  Square,
  X,
  Star,
  Calendar,
  Users,
  Search,
  Bot,
  Map,
  Camera,
} from "lucide-react-native";
import { FavoriteStackParamList } from "../navigation/FavoriteStack";

type Navigation = NativeStackNavigationProp<FavoriteStackParamList>;

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;

const FavoriteScreen = () => {
  const navigation = useNavigation<Navigation>();
  const { favorites, toggleFavorite, clearFavorites } = useFavoriteStore();
  const { setPlayer } = usePlayerStore();

  const [refreshing, setRefreshing] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // Filter favorites based on search query
  const filteredFavorites = favorites.filter(
    (player) =>
      player.playerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handlePlayerPress = (player: Player) => {
    if (isSelectionMode) {
      togglePlayerSelection(player.id);
    } else {
      setPlayer(player);
      navigation.navigate("Detail", { id: player.id });
    }
  };

  const togglePlayerSelection = (playerId: string) => {
    setSelectedPlayers((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedPlayers.length === 0) return;

    Alert.alert(
      "Xóa cầu thủ yêu thích",
      `Bạn có chắc chắn muốn xóa ${selectedPlayers.length} cầu thủ khỏi danh sách yêu thích?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => {
            selectedPlayers.forEach((playerId) => {
              const player = favorites.find((p) => p.id === playerId);
              if (player) {
                toggleFavorite(player);
              }
            });
            setSelectedPlayers([]);
            setIsSelectionMode(false);
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      "Xóa tất cả",
      "Bạn có chắc chắn muốn xóa tất cả cầu thủ yêu thích?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa tất cả",
          style: "destructive",
          onPress: () => {
            clearFavorites();
            setIsSelectionMode(false);
            setSelectedPlayers([]);
          },
        },
      ]
    );
  };

  const handleDeleteSingle = (player: Player) => {
    Alert.alert(
      "Xóa cầu thủ yêu thích",
      `Bạn có chắc chắn muốn xóa ${player.playerName} khỏi danh sách yêu thích?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => toggleFavorite(player),
        },
      ]
    );
  };

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

  const getAverageRating = (feedbacks: Feedback[]) => {
    if (feedbacks.length === 0) return "N/A";
    const avg =
      feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length;
    return avg.toFixed(1);
  };

  const renderPlayerItem = ({ item: player }: { item: Player }) => {
    const isSelected = selectedPlayers.includes(player.id);

    // Right action for swipe to delete
    const renderRightAction = (player: Player, dragX: any) => {
      const trans = dragX.interpolate({
        inputRange: [-100, -50, 0],
        outputRange: [-10, 10, 50],
        extrapolate: "clamp",
      });

      const scale = dragX.interpolate({
        inputRange: [-100, -50, 0],
        outputRange: [1, 0.9, 0.3],
        extrapolate: "clamp",
      });

      const opacity = dragX.interpolate({
        inputRange: [-100, -40, 0],
        outputRange: [1, 0.9, 0],
        extrapolate: "clamp",
      });

      return (
        <View className="flex-1 flex-row items-center justify-center bg-red-500 px-4 rounded-r-xl mr-4">
          <Animated.View
            style={[
              {
                transform: [{ translateX: trans }, { scale }],
                opacity,
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => handleSwipeDelete(player)}
              className="p-4 items-center justify-center min-w-[70px]"
              activeOpacity={0.8}
            >
              <Trash2 size={24} color="white" />
              <Text className="text-white text-xs font-medium mt-1">Xóa</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      );
    };

    const handleSwipeDelete = (player: Player) => {
      // Haptic feedback nếu có
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      Alert.alert(
        "Xóa cầu thủ yêu thích",
        `Bạn có chắc chắn muốn xóa ${player.playerName} khỏi danh sách yêu thích?`,
        [
          { text: "Hủy", style: "cancel" },
          {
            text: "Xóa",
            style: "destructive",
            onPress: () => {
              toggleFavorite(player);
              // Có thể thêm toast notification ở đây
            },
          },
        ]
      );
    };

    const PlayerCard = () => (
      <View className="mx-4 mb-3">
        <TouchableOpacity
          onPress={() => handlePlayerPress(player)}
          onLongPress={() => {
            if (!isSelectionMode) {
              setIsSelectionMode(true);
              setSelectedPlayers([player.id]);
            }
          }}
          activeOpacity={0.7}
          className={`bg-white rounded-xl border ${
            isSelected ? "border-blue-300 bg-blue-50" : "border-gray-200"
          } ${isSelectionMode && isSelected ? "shadow-lg" : "shadow-sm"}`}
        >
          <View className="flex-row items-center p-4">
            {/* Selection Checkbox */}
            {isSelectionMode && (
              <View className="mr-3">
                <Icon
                  as={isSelected ? CheckSquare : Square}
                  color={isSelected ? "#3b82f6" : "#9ca3af"}
                  size="lg"
                />
              </View>
            )}

            {/* Player Avatar */}
            <View className="relative mr-4">
              <Image
                source={{
                  uri: player.image || "https://via.placeholder.com/60",
                }}
                className="w-16 h-16 rounded-full bg-gray-200"
                resizeMode="cover"
              />

              {/* Position Badge */}
              <View
                className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full ${getPositionColor(
                  player.position
                )}`}
              >
                <Text className="text-white text-xs font-bold">
                  {player.position.slice(0, 2).toUpperCase()}
                </Text>
              </View>

              {/* Captain Badge */}
              {player.isCaptain && (
                <View className="absolute -top-1 -right-1 bg-yellow-400 rounded-full w-5 h-5 items-center justify-center">
                  <Text className="text-black text-xs font-bold">C</Text>
                </View>
              )}
            </View>

            {/* Player Info */}
            <View className="flex-1">
              <View className="flex-row items-center mb-1">
                <Text
                  className="text-gray-900 font-bold text-base flex-1"
                  numberOfLines={1}
                >
                  {player.playerName}
                </Text>

                {/* Rating */}
                <View className="flex-row items-center ml-2">
                  <Icon as={Star} color="#fbbf24" size="sm" />
                  <Text className="text-gray-700 text-sm font-medium ml-1">
                    {getAverageRating(player.feedbacks)}
                  </Text>
                </View>
              </View>

              <Text className="text-gray-600 text-sm mb-2" numberOfLines={1}>
                {player.team}
              </Text>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Icon as={Calendar} color="#9ca3af" size="sm" />
                  <Text className="text-gray-500 text-sm ml-1">
                    {player.YoB}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <Text className="text-gray-500 text-sm mr-2">
                    {player.feedbacks.length} đánh giá
                  </Text>
                  <View className="w-2 h-2 bg-green-500 rounded-full" />
                </View>
              </View>
            </View>

            {/* Action Button - only show when not in selection mode */}
            {!isSelectionMode && (
              <TouchableOpacity
                onPress={() => handleDeleteSingle(player)}
                className="ml-3 bg-red-50 rounded-full p-2"
                activeOpacity={0.7}
              >
                <Icon as={Trash2} color="#ef4444" size="sm" />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );

    // If in selection mode, don't show swipe functionality
    if (isSelectionMode) {
      return <PlayerCard />;
    }

    // Show swipeable version when not in selection mode
    return (
      <Swipeable
        renderRightActions={(progress, dragX) =>
          renderRightAction(player, dragX)
        }
        rightThreshold={40}
        friction={2}
        overshootRight={false}
        overshootLeft={false}
        containerStyle={{
          marginHorizontal: 16,
          marginBottom: 12,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <View className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <TouchableOpacity
            onPress={() => handlePlayerPress(player)}
            onLongPress={() => {
              if (!isSelectionMode) {
                setIsSelectionMode(true);
                setSelectedPlayers([player.id]);
              }
            }}
            activeOpacity={0.7}
            className="p-4"
          >
            <View className="flex-row items-center">
              {/* Player Avatar */}
              <View className="relative mr-4">
                <Image
                  source={{
                    uri: player.image || "https://via.placeholder.com/60",
                  }}
                  className="w-16 h-16 rounded-full bg-gray-200"
                  resizeMode="cover"
                />

                {/* Position Badge */}
                <View
                  className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full ${getPositionColor(
                    player.position
                  )}`}
                >
                  <Text className="text-white text-xs font-bold">
                    {player.position.slice(0, 2).toUpperCase()}
                  </Text>
                </View>

                {/* Captain Badge */}
                {player.isCaptain && (
                  <View className="absolute -top-1 -right-1 bg-yellow-400 rounded-full w-5 h-5 items-center justify-center">
                    <Text className="text-black text-xs font-bold">C</Text>
                  </View>
                )}
              </View>

              {/* Player Info */}
              <View className="flex-1">
                <View className="flex-row items-center mb-1">
                  <Text
                    className="text-gray-900 font-bold text-base flex-1"
                    numberOfLines={1}
                  >
                    {player.playerName}
                  </Text>

                  {/* Rating */}
                  <View className="flex-row items-center ml-2">
                    <Icon as={Star} color="#fbbf24" size="sm" />
                    <Text className="text-gray-700 text-sm font-medium ml-1">
                      {getAverageRating(player.feedbacks)}
                    </Text>
                  </View>
                </View>

                <Text className="text-gray-600 text-sm mb-2" numberOfLines={1}>
                  {player.team}
                </Text>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Icon as={Calendar} color="#9ca3af" size="sm" />
                    <Text className="text-gray-500 text-sm ml-1">
                      {player.YoB}
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <Text className="text-gray-500 text-sm mr-2">
                      {player.feedbacks.length} đánh giá
                    </Text>
                    <View className="w-2 h-2 bg-green-500 rounded-full" />
                  </View>
                </View>
              </View>

              {/* Swipe Indicator */}
              <View className="ml-3 opacity-30">
                <Text className="text-gray-400 text-xs">← Vuốt để xóa</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </Swipeable>
    );
  };

  if (favorites.length === 0) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View className="flex-1 bg-gray-50">
          {/* Header */}
          <View className="bg-white px-6 py-4 border-b border-gray-200">
            <Text className="text-2xl font-bold text-gray-900">
              Cầu thủ yêu thích
            </Text>
            <Text className="text-gray-600 text-sm mt-1">
              Quản lý danh sách cầu thủ yêu thích của bạn
            </Text>
          </View>

          {/* Empty State */}
          <View className="flex-1 justify-center items-center px-6">
            <View className="bg-gray-100 rounded-full p-8 mb-6">
              <Icon as={Heart} color="#6b7280" size="xl" />
            </View>
            <Text className="text-xl font-bold text-gray-900 mb-2">
              Chưa có cầu thủ yêu thích
            </Text>
            <Text className="text-gray-600 text-center leading-relaxed">
              Hãy thêm những cầu thủ bạn yêu thích vào danh sách để theo dõi
              thông tin của họ
            </Text>
            <TouchableOpacity
              onPress={() => navigation.getParent()?.navigate("HomeTab")}
              className="bg-blue-500 px-6 py-3 rounded-full mt-6"
            >
              <Text className="text-white font-semibold">Khám phá cầu thủ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white px-6 py-4 border-b border-gray-200">
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900">
                {isSelectionMode
                  ? `Đã chọn ${selectedPlayers.length}`
                  : "Cầu thủ yêu thích"}
              </Text>
              <Text className="text-gray-600 text-sm mt-1">
                {isSelectionMode
                  ? "Chọn cầu thủ để xóa"
                  : `${favorites.length} cầu thủ trong danh sách`}
              </Text>
            </View>

            <View className="flex-row items-center">
              {/* Search Button */}
              {!isSelectionMode && (
                <TouchableOpacity
                  onPress={() => setIsSearchVisible(!isSearchVisible)}
                  className="p-2 mr-2"
                >
                  <Search size={24} color="#3b82f6" />
                </TouchableOpacity>
              )}

              {isSelectionMode ? (
                <View className="flex-row">
                  <TouchableOpacity
                    onPress={() => {
                      setIsSelectionMode(false);
                      setSelectedPlayers([]);
                    }}
                    className="bg-gray-100 rounded-full p-2 mr-2"
                  >
                    <Icon as={X} color="#6b7280" size="lg" />
                  </TouchableOpacity>

                  {selectedPlayers.length > 0 && (
                    <TouchableOpacity
                      onPress={handleDeleteSelected}
                      className="bg-red-500 rounded-full p-2"
                    >
                      <Icon as={Trash2} color="white" size="lg" />
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleClearAll}
                  className="bg-red-50 px-3 py-2 rounded-full"
                >
                  <Text className="text-red-600 font-semibold text-sm">
                    Xóa tất cả
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Search Input */}
          {isSearchVisible && !isSelectionMode && (
            <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
              <Search size={20} color="#6b7280" />
              <TextInput
                className="flex-1 ml-3 text-gray-900"
                placeholder="Tìm kiếm cầu thủ yêu thích..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  className="p-1"
                >
                  <X size={20} color="#6b7280" />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Search Results Info */}
          {searchQuery.length > 0 && !isSelectionMode && (
            <Text className="text-gray-600 text-sm mt-2">
              Tìm thấy {filteredFavorites.length} kết quả cho "{searchQuery}"
            </Text>
          )}
        </View>

        {/* AI Features Quick Access */}
        {!isSelectionMode && (
          <View className="bg-gray-50 px-6 py-4">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              🤖 Tính năng AI
            </Text>
            <View className="flex-row justify-between space-x-2">
              <TouchableOpacity
                onPress={() => navigation.navigate("AIAnalysis")}
                className="flex-1 bg-blue-500 p-3 rounded-xl items-center mr-2"
              >
                <Bot size={20} color="#fff" />
                <Text className="text-white font-semibold mt-2 text-center text-sm">
                  AI Chat
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("StadiumMap")}
                className="flex-1 bg-purple-500 p-3 rounded-xl items-center ml-2"
              >
                <Map size={20} color="#fff" />
                <Text className="text-white font-semibold mt-2 text-center text-sm">
                  Bản đồ
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Selection Mode Actions */}
        {isSelectionMode && (
          <View className="bg-blue-50 px-6 py-3 border-b border-blue-200">
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => {
                  if (selectedPlayers.length === favorites.length) {
                    setSelectedPlayers([]);
                  } else {
                    setSelectedPlayers(favorites.map((p) => p.id));
                  }
                }}
                className="flex-row items-center"
              >
                <Icon
                  as={
                    selectedPlayers.length === favorites.length
                      ? CheckSquare
                      : Square
                  }
                  color="#3b82f6"
                  size="lg"
                />
                <Text className="text-blue-600 font-semibold ml-2">
                  {selectedPlayers.length === favorites.length
                    ? "Bỏ chọn tất cả"
                    : "Chọn tất cả"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Players List */}
        <FlatList
          data={searchQuery ? filteredFavorites : favorites}
          renderItem={renderPlayerItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 16 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            searchQuery ? (
              <View className="flex-1 justify-center items-center py-20">
                <View className="bg-white p-8 rounded-xl shadow-sm items-center mx-6">
                  <Search size={48} color="#d1d5db" />
                  <Text className="text-gray-600 text-lg text-center mb-2 mt-4">
                    Không tìm thấy cầu thủ nào
                  </Text>
                  <Text className="text-gray-400 text-sm text-center">
                    Thử tìm kiếm với từ khóa khác
                  </Text>
                </View>
              </View>
            ) : null
          }
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default FavoriteScreen;
