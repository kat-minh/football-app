import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "./ui/icon";
import { Bell } from "lucide-react-native";

export const HeaderHome = ({ navigation }: NativeStackHeaderProps) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: "#ffffff",
        elevation: 4, // Android shadow
        shadowColor: "#000", // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderBottomWidth: 0.5,
        borderBottomColor: "#ddd",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Image
          source={require("@/src/assets/images/splash.png")}
          style={{ width: 40, height: 40, borderRadius: 8 }}
          resizeMode="contain"
        />

        <Text style={{ fontSize: 14, fontWeight: "600", color: "#333" }}>
          Football App
        </Text>
      </View>

      {/* Nút thông báo bên phải */}
      <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
        <Icon
          as={Bell}
          color="#FB923C"
          size="xl"
          style={{
            width: 24,
            height: 24,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};
