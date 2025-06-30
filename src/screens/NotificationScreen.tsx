import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Bell, Clock, Users, Heart, ArrowLeft } from "lucide-react-native";
import { HomeStackParamList } from "../navigation/HomeStack";

type Navigation = NativeStackNavigationProp<HomeStackParamList, "Notification">;

const NotificationScreen = () => {
  const navigation = useNavigation<Navigation>();
  const notifications = [
    {
      id: 1,
      type: "favorite",
      title: "Cầu thủ yêu thích",
      message: "Lionel Messi đã được thêm vào danh sách yêu thích",
      time: "2 phút trước",
      icon: Heart,
      color: "#ef4444",
      read: false,
    },
    {
      id: 2,
      type: "team",
      title: "Cập nhật đội hình",
      message: "Barcelona đã có thay đổi trong đội hình chính thức",
      time: "1 giờ trước",
      icon: Users,
      color: "#3b82f6",
      read: false,
    },
    {
      id: 3,
      type: "general",
      title: "Thông báo hệ thống",
      message: "Ứng dụng đã được cập nhật lên phiên bản mới",
      time: "3 giờ trước",
      icon: Bell,
      color: "#f59e0b",
      read: true,
    },
    {
      id: 4,
      type: "favorite",
      title: "Cầu thủ yêu thích",
      message: "Cristiano Ronaldo đã được thêm vào danh sách yêu thích",
      time: "1 ngày trước",
      icon: Heart,
      color: "#ef4444",
      read: true,
    },
  ];

  const renderNotification = (notification: any) => {
    const IconComponent = notification.icon;

    return (
      <TouchableOpacity
        key={notification.id}
        className={`bg-white mx-4 mb-3 p-4 rounded-xl shadow-sm border-l-4 ${
          notification.read ? "border-gray-200" : "border-blue-500"
        }`}
        activeOpacity={0.7}
      >
        <View className="flex-row items-start">
          <View
            className="p-2 rounded-full mr-3"
            style={{ backgroundColor: `${notification.color}20` }}
          >
            <IconComponent size={20} color={notification.color} />
          </View>

          <View className="flex-1">
            <Text
              className={`text-base font-semibold mb-1 ${
                notification.read ? "text-gray-600" : "text-gray-900"
              }`}
            >
              {notification.title}
            </Text>

            <Text
              className={`text-sm mb-2 ${
                notification.read ? "text-gray-500" : "text-gray-700"
              }`}
            >
              {notification.message}
            </Text>

            <View className="flex-row items-center">
              <Clock size={14} color="#9ca3af" />
              <Text className="text-xs text-gray-500 ml-1">
                {notification.time}
              </Text>
            </View>
          </View>

          {!notification.read && (
            <View className="w-3 h-3 bg-blue-500 rounded-full mt-1" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      {/* Header with Back Button */}
      <View className="bg-white px-4 py-3 border-b border-gray-100 flex-row items-center">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 mr-3"
        >
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>

        <Text className="text-xl font-bold text-gray-900 flex-1">
          Thông báo
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Stats Section */}
        <View className="bg-white px-6 py-4 border-b border-gray-100">
          <Text className="text-gray-600 text-base">
            {unreadCount > 0
              ? `Bạn có ${unreadCount} thông báo chưa đọc`
              : "Tất cả thông báo đã được đọc"}
          </Text>
        </View>

        {/* Quick Actions */}
        <View className="px-6 py-4">
          <View className="flex-row justify-between">
            <TouchableOpacity className="bg-blue-50 flex-1 mr-2 p-4 rounded-xl items-center">
              <Bell size={24} color="#3b82f6" />
              <Text className="text-blue-600 font-semibold mt-2 text-sm">
                Đánh dấu tất cả
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-red-50 flex-1 ml-2 p-4 rounded-xl items-center">
              <Text className="text-red-600 text-2xl font-bold">🗑️</Text>
              <Text className="text-red-600 font-semibold mt-2 text-sm">
                Xóa tất cả
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notifications List */}
        <View className="py-2">
          {notifications.length > 0 ? (
            notifications.map(renderNotification)
          ) : (
            <View className="flex-1 justify-center items-center py-20">
              <Bell size={64} color="#d1d5db" />
              <Text className="text-gray-500 text-lg mt-4 text-center">
                Không có thông báo nào
              </Text>
              <Text className="text-gray-400 text-sm text-center mt-2">
                Các thông báo mới sẽ xuất hiện tại đây
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default NotificationScreen;
