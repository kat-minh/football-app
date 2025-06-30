import React from "react";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import FavoriteScreen from "../screens/FavoritesScreen";
import DetailScreen from "../screens/DetailScreen";
import AIAnalysisScreen from "../screens/AIAnalysisScreen";
import StadiumMapScreen from "../screens/StadiumMapScreen";
import { HeaderDetail } from "../components/HeaderDetail";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { Player } from "../types/player";

const Stack = createNativeStackNavigator();

const favoriteOptions: NativeStackNavigationOptions = {
  headerShown: false,
};

const detailOptions: NativeStackNavigationOptions = {
  header: (props: NativeStackHeaderProps) => <HeaderDetail {...props} />,
};

export type FavoriteStackParamList = {
  Favorites: undefined;
  Detail: { id: string } | undefined;
  AIAnalysis: { player?: Player } | undefined;
  StadiumMap: undefined;
};

export default function FavoriteStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Favorites"
        component={FavoriteScreen}
        options={favoriteOptions}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={detailOptions}
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
