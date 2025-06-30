import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

export interface ImagePickerResult {
  uri: string;
  base64?: string;
  type: "image" | "video";
  width?: number;
  height?: number;
}

export class ImagePickerService {
  async requestPermissions(): Promise<boolean> {
    try {
      // Request camera permissions
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();

      // Request media library permissions
      const mediaPermission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      return (
        cameraPermission.status === "granted" &&
        mediaPermission.status === "granted"
      );
    } catch (error) {
      console.error("Error requesting permissions:", error);
      return false;
    }
  }

  async pickImageFromLibrary(options?: {
    allowsEditing?: boolean;
    aspect?: [number, number];
    quality?: number;
    base64?: boolean;
  }): Promise<ImagePickerResult | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error("Quyền truy cập thư viện ảnh bị từ chối");
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: options?.allowsEditing ?? true,
        aspect: options?.aspect ?? [4, 3],
        quality: options?.quality ?? 0.8,
        base64: options?.base64 ?? false,
      });

      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          base64: asset.base64 || undefined,
          type: "image",
          width: asset.width,
          height: asset.height,
        };
      }

      return null;
    } catch (error) {
      console.error("Error picking image from library:", error);
      throw error;
    }
  }

  async takePhoto(options?: {
    allowsEditing?: boolean;
    aspect?: [number, number];
    quality?: number;
    base64?: boolean;
  }): Promise<ImagePickerResult | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error("Quyền truy cập camera bị từ chối");
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: options?.allowsEditing ?? true,
        aspect: options?.aspect ?? [4, 3],
        quality: options?.quality ?? 0.8,
        base64: options?.base64 ?? false,
      });

      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          base64: asset.base64 || undefined,
          type: "image",
          width: asset.width,
          height: asset.height,
        };
      }

      return null;
    } catch (error) {
      console.error("Error taking photo:", error);
      throw error;
    }
  }

  async convertImageToBase64(uri: string): Promise<string> {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error("Error converting image to base64:", error);
      throw error;
    }
  }

  async saveImageToDevice(uri: string, filename?: string): Promise<string> {
    try {
      const timestamp = new Date().getTime();
      const finalFilename = filename || `player_image_${timestamp}.jpg`;
      const documentsDir = FileSystem.documentDirectory;
      const localUri = `${documentsDir}${finalFilename}`;

      await FileSystem.copyAsync({
        from: uri,
        to: localUri,
      });

      return localUri;
    } catch (error) {
      console.error("Error saving image:", error);
      throw error;
    }
  }
}

export const imagePickerService = new ImagePickerService();
