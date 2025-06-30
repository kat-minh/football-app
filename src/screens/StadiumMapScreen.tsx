import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import {
  locationService,
  LocationData,
  StadiumLocation,
} from "../services/locationService";

type Props = NativeStackScreenProps<any, "StadiumMap">;

const { width: screenWidth } = Dimensions.get("window");

export default function StadiumMapScreen({ navigation }: Props) {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(
    null
  );
  const [nearbyStadiums, setNearbyStadiums] = useState<StadiumLocation[]>([]);
  const [selectedStadium, setSelectedStadium] =
    useState<StadiumLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeMap();
  }, []);

  const initializeMap = async () => {
    try {
      setIsLoading(true);

      // Get current location
      const location = await locationService.getCurrentLocation();
      if (location) {
        setCurrentLocation(location);

        // Get nearby stadiums
        const stadiums = locationService.findNearbyStadiums(
          location.latitude,
          location.longitude,
          50 // 50km radius
        );
        setNearbyStadiums(stadiums);
      }
    } catch (error) {
      Alert.alert(
        "Lỗi",
        "Không thể tải bản đồ. Vui lòng kiểm tra quyền truy cập vị trí."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshLocation = () => {
    initializeMap();
  };

  const handleStadiumPress = (stadium: StadiumLocation) => {
    setSelectedStadium(stadium);
  };

  const renderStadiumInfo = () => {
    if (!selectedStadium) return null;

    return (
      <View style={styles.stadiumInfo}>
        <View style={styles.stadiumHeader}>
          <Text style={styles.stadiumName}>{selectedStadium.name}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedStadium(null)}
          >
            <Ionicons name="close" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <Text style={styles.stadiumTeam}>🏟️ {selectedStadium.team}</Text>

        {selectedStadium.capacity && (
          <Text style={styles.stadiumDetail}>
            👥 Sức chứa: {selectedStadium.capacity.toLocaleString()} người
          </Text>
        )}

        <Text style={styles.stadiumDetail}>
          📍 Tọa độ: {selectedStadium.latitude.toFixed(4)},{" "}
          {selectedStadium.longitude.toFixed(4)}
        </Text>

        {selectedStadium.address && (
          <Text style={styles.stadiumDetail}>🏠 {selectedStadium.address}</Text>
        )}

        {selectedStadium.description && (
          <Text style={styles.stadiumDescription}>
            {selectedStadium.description}
          </Text>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Đang tải bản đồ...</Text>
      </View>
    );
  }

  if (!currentLocation) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không thể xác định vị trí</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={handleRefreshLocation}
        >
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bản đồ sân vận động</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefreshLocation}
        >
          <Ionicons name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Map */}
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* Current Location Marker */}
        <Marker
          coordinate={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          }}
          title="Vị trí của bạn"
          description="Vị trí hiện tại"
          pinColor="blue"
        />

        {/* Stadium Markers */}
        {nearbyStadiums.map((stadium, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: stadium.latitude,
              longitude: stadium.longitude,
            }}
            title={stadium.name}
            description={stadium.team}
            pinColor="red"
            onPress={() => handleStadiumPress(stadium)}
          />
        ))}
      </MapView>

      {/* Stadium Info Panel */}
      {renderStadiumInfo()}

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          📍 Tìm thấy {nearbyStadiums.length} sân vận động gần bạn
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingTop: 44,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
  },
  refreshButton: {
    marginLeft: 16,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  stadiumInfo: {
    position: "absolute",
    bottom: 80,
    left: 16,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  stadiumHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  stadiumName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  stadiumTeam: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
    marginBottom: 4,
  },
  stadiumDetail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  stadiumDescription: {
    fontSize: 14,
    color: "#333",
    marginTop: 8,
    lineHeight: 20,
  },
  statsContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  statsText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
});
