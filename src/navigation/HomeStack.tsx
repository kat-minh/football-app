import React from "react";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
  NativeStackHeaderProps,
} from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import DetailScreen from "../screens/DetailScreen";
import NotificationScreen from "../screens/NotificationScreen";
import AIAnalysisScreen from "../screens/AIAnalysisScreen";
import StadiumMapScreen from "../screens/StadiumMapScreen";
import { HeaderHome } from "../components/HeaderHome";
import { HeaderDetail } from "../components/HeaderDetail";
import { Player } from "../types/player";

const Stack = createNativeStackNavigator();

const stackOptions: NativeStackNavigationOptions = {
  header: (props: NativeStackHeaderProps) => <HeaderHome {...props} />,
};

const detailOptions: NativeStackNavigationOptions = {
  header: (props: NativeStackHeaderProps) => <HeaderDetail {...props} />,
};

export type HomeStackParamList = {
  Home: undefined;
  Detail: { id: string } | undefined;
  Notification: undefined;
  AIAnalysis: { player?: Player } | undefined;
  StadiumMap: undefined;
};

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={stackOptions} />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={detailOptions}
      />
      <Stack.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          title: "Thông báo",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AIAnalysis"
        component={AIAnalysisScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="StadiumMap"
        component={StadiumMapScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
