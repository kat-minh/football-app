import React, { useCallback, useEffect, useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  RefreshControl,
  ScrollView,
  Text,
  View,
  FlatList,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Modal,
} from "react-native";
import {
  Search,
  X,
  Bot,
  Map,
  Camera,
  Filter,
  Star,
  Trophy,
  Users,
} from "lucide-react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { usePlayerStore } from "../store/playerStore";
import { useFavoriteStore } from "../store/favoriteStore";
import { getAllPlayers } from "../services/playerService";
import { PlayerCard } from "../components/PlayerCard";
import { Loading } from "../components/Loading";
import { HomeStackParamList } from "../navigation/HomeStack";

type Navigation = NativeStackNavigationProp<HomeStackParamList, "Detail">;

const HomeScreen = () => {
  const navigation = useNavigation<Navigation>();
  const searchInputRef = useRef<TextInput>(null);

  const { isLoading, fetchPlayers, players } = usePlayerStore();
  const { favorites, toggleFavorite, isFavorite } = useFavoriteStore();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Filter states
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [showOnlyCaptains, setShowOnlyCaptains] = useState(false);

  // Get unique teams and positions for filter options
  const teams = [...new Set(players.map((p) => p.team))].sort();
  const positions = [...new Set(players.map((p) => p.position))].sort();

  // Filter players based on search query and filters
  const filteredPlayers = players.filter((player) => {
    const matchesSearch =
      player.playerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.position.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTeam = !selectedTeam || player.team === selectedTeam;
    const matchesPosition =
      !selectedPosition || player.position === selectedPosition;
    const matchesFavorites = !showOnlyFavorites || isFavorite(player.id);
    const matchesCaptains = !showOnlyCaptains || player.isCaptain;

    return (
      matchesSearch &&
      matchesTeam &&
      matchesPosition &&
      matchesFavorites &&
      matchesCaptains
    );
  });

  useEffect(() => {
    fetchPlayers();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPlayers();
    setRefreshing(false);
  }, [fetchPlayers]);

  const handlePlayerPress = (playerId: string) => {
    navigation.navigate("Detail", { id: playerId });
  };

  const handleFavoritePress = useCallback(
    (player: any) => {
      toggleFavorite(player);
    },
    [toggleFavorite]
  );

  const renderPlayerCard = ({ item, index }: { item: any; index: number }) => (
    <View
      style={{
        marginRight: index % 2 === 0 ? 8 : 0,
        marginLeft: index % 2 === 1 ? 8 : 0,
      }}
    >
      <PlayerCard
        player={item}
        onPress={() => handlePlayerPress(item.id)}
        onFavoritePress={() => handleFavoritePress(item)}
        isFavorite={isFavorite(item.id)}
      />
    </View>
  );

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearchVisible(false);
    Keyboard.dismiss();
  };

  const handleSearchPress = () => {
    setIsSearchVisible(true);
    // Delay để đảm bảo TextInput được render trước khi focus
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const clearFilters = () => {
    setSelectedTeam("");
    setSelectedPosition("");
    setShowOnlyFavorites(false);
    setShowOnlyCaptains(false);
  };

  const hasActiveFilters =
    selectedTeam || selectedPosition || showOnlyFavorites || showOnlyCaptains;

  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <TouchableOpacity
        className="flex-1 bg-black/50 justify-end"
        activeOpacity={1}
        onPress={() => setShowFilterModal(false)}
      >
        <TouchableOpacity
          className="bg-white rounded-t-3xl px-6 py-6"
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold text-gray-900">Bộ lọc</Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Team Filter */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-800 mb-3">
              Đội bóng
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                onPress={() => setSelectedTeam("")}
                className={`mr-3 px-4 py-2 rounded-full border ${
                  !selectedTeam
                    ? "bg-indigo-500 border-indigo-500"
                    : "bg-white border-gray-300"
                }`}
              >
                <Text
                  className={
                    !selectedTeam ? "text-white font-medium" : "text-gray-700"
                  }
                >
                  Tất cả
                </Text>
              </TouchableOpacity>
              {teams.map((team) => (
                <TouchableOpacity
                  key={team}
                  onPress={() => setSelectedTeam(team)}
                  className={`mr-3 px-4 py-2 rounded-full border ${
                    selectedTeam === team
                      ? "bg-indigo-500 border-indigo-500"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <Text
                    className={
                      selectedTeam === team
                        ? "text-white font-medium"
                        : "text-gray-700"
                    }
                  >
                    {team}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Position Filter */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-800 mb-3">
              Vị trí
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                onPress={() => setSelectedPosition("")}
                className={`mr-3 px-4 py-2 rounded-full border ${
                  !selectedPosition
                    ? "bg-purple-500 border-purple-500"
                    : "bg-white border-gray-300"
                }`}
              >
                <Text
                  className={
                    !selectedPosition
                      ? "text-white font-medium"
                      : "text-gray-700"
                  }
                >
                  Tất cả
                </Text>
              </TouchableOpacity>
              {positions.map((position) => (
                <TouchableOpacity
                  key={position}
                  onPress={() => setSelectedPosition(position)}
                  className={`mr-3 px-4 py-2 rounded-full border ${
                    selectedPosition === position
                      ? "bg-purple-500 border-purple-500"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <Text
                    className={
                      selectedPosition === position
                        ? "text-white font-medium"
                        : "text-gray-700"
                    }
                  >
                    {position}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Special Filters */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-800 mb-3">
              Đặc biệt
            </Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`flex-1 mr-2 px-4 py-3 rounded-xl border flex-row items-center justify-center ${
                  showOnlyFavorites
                    ? "bg-red-500 border-red-500"
                    : "bg-white border-gray-300"
                }`}
              >
                <Star
                  size={16}
                  color={showOnlyFavorites ? "white" : "#6b7280"}
                />
                <Text
                  className={`ml-2 font-medium ${
                    showOnlyFavorites ? "text-white" : "text-gray-700"
                  }`}
                >
                  Yêu thích
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowOnlyCaptains(!showOnlyCaptains)}
                className={`flex-1 ml-2 px-4 py-3 rounded-xl border flex-row items-center justify-center ${
                  showOnlyCaptains
                    ? "bg-yellow-500 border-yellow-500"
                    : "bg-white border-gray-300"
                }`}
              >
                <Trophy
                  size={16}
                  color={showOnlyCaptains ? "white" : "#6b7280"}
                />
                <Text
                  className={`ml-2 font-medium ${
                    showOnlyCaptains ? "text-white" : "text-gray-700"
                  }`}
                >
                  Đội trưởng
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={clearFilters}
              className="flex-1 mr-2 py-3 px-4 bg-gray-100 rounded-xl items-center"
            >
              <Text className="text-gray-700 font-medium">Xóa bộ lọc</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowFilterModal(false)}
              className="flex-1 ml-2 py-3 px-4 bg-indigo-500 rounded-xl items-center"
            >
              <Text className="text-white font-medium">Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <View className="flex-1 bg-indigo-50">
      <StatusBar barStyle="dark-content" backgroundColor="#eef2ff" />

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View className="bg-indigo-600 px-6 py-8">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-1">
              <Text className="text-3xl font-bold text-white mb-2">
                ⚽ Đội hình
              </Text>
              <Text className="text-indigo-100 text-base opacity-90">
                Khám phá thông tin các cầu thủ
              </Text>
            </View>

            {/* Search and Filter Buttons */}
            <View className="flex-row">
              <TouchableOpacity
                onPress={handleSearchPress}
                className="p-3 rounded-full mr-2"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                <Search size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowFilterModal(true)}
                className={`p-3 rounded-full ${
                  hasActiveFilters ? "bg-yellow-400" : ""
                }`}
                style={
                  !hasActiveFilters
                    ? { backgroundColor: "rgba(255, 255, 255, 0.2)" }
                    : {}
                }
              >
                <Filter
                  size={20}
                  color={hasActiveFilters ? "#7c3aed" : "white"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Input */}
          {isSearchVisible && (
            <View className="flex-row items-center bg-white rounded-2xl px-4 py-3 mb-4 shadow-lg">
              <Search size={20} color="#6366f1" />
              <TextInput
                ref={searchInputRef}
                className="flex-1 ml-3 text-gray-900"
                placeholder="Tìm kiếm cầu thủ, đội bóng, vị trí..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
                clearButtonMode="while-editing"
                style={{
                  fontSize: 16,
                  color: "#111827",
                  padding: 0,
                  minHeight: 20,
                }}
                placeholderTextColor="#6b7280"
                onSubmitEditing={() => Keyboard.dismiss()}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={clearSearch} className="p-1">
                  <X size={20} color="#6b7280" />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <View className="mb-4">
              <Text className="text-white text-sm mb-2 opacity-80">
                Bộ lọc đang áp dụng:
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {selectedTeam && (
                  <View
                    className="rounded-full px-3 py-1 mr-2 flex-row items-center"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                  >
                    <Users size={12} color="white" />
                    <Text className="text-white text-xs ml-1">
                      {selectedTeam}
                    </Text>
                  </View>
                )}
                {selectedPosition && (
                  <View
                    className="rounded-full px-3 py-1 mr-2"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                  >
                    <Text className="text-white text-xs">
                      {selectedPosition}
                    </Text>
                  </View>
                )}
                {showOnlyFavorites && (
                  <View
                    className="rounded-full px-3 py-1 mr-2 flex-row items-center"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                  >
                    <Star size={12} color="white" />
                    <Text className="text-white text-xs ml-1">Yêu thích</Text>
                  </View>
                )}
                {showOnlyCaptains && (
                  <View
                    className="rounded-full px-3 py-1 mr-2 flex-row items-center"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                  >
                    <Trophy size={12} color="white" />
                    <Text className="text-white text-xs ml-1">Đội trưởng</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          )}

          {/* Search Results Info */}
          {(searchQuery.length > 0 || hasActiveFilters) && (
            <Text className="text-white text-sm mb-2 opacity-90">
              Tìm thấy {filteredPlayers.length} kết quả
              {searchQuery ? ` cho "${searchQuery}"` : ""}
            </Text>
          )}

          {/* Stats Overview */}
          <View className="flex-row justify-between p-4 bg-white rounded-2xl shadow-lg">
            <View className="items-center">
              <Text className="text-2xl font-bold text-indigo-600">
                {searchQuery || hasActiveFilters
                  ? filteredPlayers.length
                  : players.length}
              </Text>
              <Text className="text-indigo-600 text-sm font-medium">
                {searchQuery || hasActiveFilters ? "Kết quả" : "Cầu thủ"}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-emerald-600">
                {players.filter((p) => p.isCaptain).length}
              </Text>
              <Text className="text-emerald-600 text-sm font-medium">
                Đội trưởng
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-purple-600">
                {new Set(players.map((p) => p.team)).size}
              </Text>
              <Text className="text-purple-600 text-sm font-medium">
                Đội bóng
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-rose-600">
                {favorites.length}
              </Text>
              <Text className="text-rose-600 text-sm font-medium">
                Yêu thích
              </Text>
            </View>
          </View>
        </View>

        {/* AI Features Quick Access */}
        <View className="px-6 py-6 bg-white">
          <View className="flex-row items-center mb-4">
            <View className="bg-blue-500 p-2 rounded-xl mr-3">
              <Bot size={20} color="white" />
            </View>
            <Text className="text-xl font-bold text-gray-900">
              Tính năng AI
            </Text>
          </View>
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={() => navigation.navigate("AIAnalysis")}
              className="flex-1 bg-blue-500 p-5 rounded-2xl items-center shadow-lg mr-2"
            >
              <Bot size={28} color="#fff" />
              <Text className="text-white font-bold mt-2 text-center text-base">
                AI Chat
              </Text>
              <Text className="text-blue-100 text-xs text-center mt-1">
                Trò chuyện về bóng đá
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("StadiumMap")}
              className="flex-1 bg-purple-500 p-5 rounded-2xl items-center shadow-lg ml-2"
            >
              <Map size={28} color="#fff" />
              <Text className="text-white font-bold mt-2 text-center text-base">
                Bản đồ
              </Text>
              <Text className="text-purple-100 text-xs text-center mt-1">
                Sân vận động
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Players Grid */}
        <View className="px-6 py-6 bg-gray-50">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-gray-900">
              Danh sách cầu thủ
            </Text>
            {hasActiveFilters && (
              <TouchableOpacity
                onPress={clearFilters}
                className="bg-red-100 px-3 py-1 rounded-full"
              >
                <Text className="text-red-600 text-sm font-medium">
                  Xóa bộ lọc
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {isLoading ? (
            <Loading message="Đang tải danh sách cầu thủ" />
          ) : filteredPlayers.length === 0 ? (
            <View className="flex-1 justify-center items-center py-20">
              <View className="bg-white p-8 rounded-2xl shadow-sm items-center border border-gray-100">
                <View className="bg-gray-100 p-4 rounded-full mb-4">
                  <Users size={32} color="#6b7280" />
                </View>
                <Text className="text-gray-600 text-lg text-center mb-2 font-medium">
                  {searchQuery || hasActiveFilters
                    ? `Không tìm thấy cầu thủ nào`
                    : "Không có cầu thủ nào"}
                </Text>
                <Text className="text-gray-400 text-sm text-center">
                  {searchQuery || hasActiveFilters
                    ? "Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc"
                    : "Kéo xuống để làm mới danh sách"}
                </Text>
              </View>
            </View>
          ) : (
            <FlatList
              data={filteredPlayers}
              renderItem={renderPlayerCard}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View className="h-4" />}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </View>
      </ScrollView>

      {/* Filter Modal */}
      {renderFilterModal()}
    </View>
  );
};

export default HomeScreen;
