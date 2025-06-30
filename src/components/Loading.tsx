import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

interface LoadingProps {
  message?: string;
}

export const Loading: React.FC<LoadingProps> = ({ message = "Đang tải..." }) => {
  return (
    <View className="flex-1 justify-center items-center py-20">
      <View className="bg-white p-8 rounded-xl shadow-sm items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-600 text-lg text-center mt-4">{message}</Text>
        <Text className="text-gray-400 text-sm text-center mt-2">
          Vui lòng chờ trong giây lát
        </Text>
      </View>
    </View>
  );
};
