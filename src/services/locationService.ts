import * as Location from "expo-location";

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
}

export interface StadiumLocation extends LocationData {
  name: string;
  team: string;
  capacity?: number;
  description?: string;
}

export class LocationService {
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.error("Error requesting location permissions:", error);
      return false;
    }
  }

  async getCurrentLocation(): Promise<LocationData | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error("Quyền truy cập vị trí bị từ chối");
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy || undefined,
      };
    } catch (error) {
      console.error("Error getting current location:", error);
      throw error;
    }
  }

  async reverseGeocode(latitude: number, longitude: number): Promise<string> {
    try {
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addresses && addresses.length > 0) {
        const address = addresses[0];
        return `${address.street || ""} ${address.district || ""}, ${
          address.city || ""
        }, ${address.region || ""}, ${address.country || ""}`.trim();
      }

      return "Không xác định được địa chỉ";
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      return "Lỗi khi xác định địa chỉ";
    }
  }

  async geocode(address: string): Promise<LocationData | null> {
    try {
      const locations = await Location.geocodeAsync(address);

      if (locations && locations.length > 0) {
        const location = locations[0];
        return {
          latitude: location.latitude,
          longitude: location.longitude,
          address,
        };
      }

      return null;
    } catch (error) {
      console.error("Error geocoding address:", error);
      throw error;
    }
  }

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // Sample stadium locations in Vietnam
  getVietnameseStadiums(): StadiumLocation[] {
    return [
      {
        name: "Sân vận động Mỹ Đình",
        team: "Đội tuyển Việt Nam",
        latitude: 21.0137,
        longitude: 105.7667,
        capacity: 40192,
        description: "Sân vận động quốc gia Việt Nam tại Hà Nội",
      },
      {
        name: "Sân vận động Thống Nhất",
        team: "Saigon FC",
        latitude: 10.7877,
        longitude: 106.6966,
        capacity: 15000,
        description: "Sân vận động lịch sử tại TP. Hồ Chí Minh",
      },
      {
        name: "Sân vận động Hàng Đẫy",
        team: "Hà Nội FC",
        latitude: 21.0267,
        longitude: 105.8413,
        capacity: 22500,
        description: "Sân nhà của Hà Nội FC",
      },
      {
        name: "Sân vận động Lạch Tray",
        team: "Hải Phòng FC",
        latitude: 20.8525,
        longitude: 106.6837,
        capacity: 30000,
        description: "Sân nhà của Hải Phòng FC",
      },
      {
        name: "Sân vận động 19-8",
        team: "CLB Becamex Bình Dương",
        latitude: 11.1513,
        longitude: 106.6131,
        capacity: 18250,
        description: "Sân nhà của Becamex Bình Dương",
      },
    ];
  }

  findNearbyStadiums(
    userLat: number,
    userLon: number,
    radiusKm: number = 50
  ): StadiumLocation[] {
    const stadiums = this.getVietnameseStadiums();

    return stadiums
      .map((stadium) => ({
        ...stadium,
        distance: this.calculateDistance(
          userLat,
          userLon,
          stadium.latitude,
          stadium.longitude
        ),
      }))
      .filter((stadium) => stadium.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
  }
}

export const locationService = new LocationService();
