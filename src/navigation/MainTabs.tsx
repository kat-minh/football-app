import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import React from "react";

import { Building2, GraduationCap, Heart, Home, UserRound } from "lucide-react-native";
import { Platform, View } from "react-native";
import HomeStack from "./HomeStack";
import FavoriteStack from "./FavoriteStack";

export type BottomTabParamList = {
  HomeTab: undefined;
  FavoriteTab: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const tabOptions: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarStyle: {
    backgroundColor: "#fefce8",
    borderTopWidth: 0,
    height: 80,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabBarActiveTintColor: "#FB923C",
  tabBarInactiveTintColor: "#6b7280",
  tabBarLabelStyle: {
    fontSize: 12,
    fontWeight: "500",
  },
  tabBarIconStyle: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 2,
  },
};

const renderTabIcon =
  (IconComponent: React.ElementType) =>
  ({ color }: { color: string }) =>
    <IconComponent size={24} color={color} />;

const MainTabs = () => {
  return (
    <>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <Tab.Navigator initialRouteName="HomeTab" screenOptions={tabOptions}>
          <Tab.Screen
            name="HomeTab"
            component={HomeStack}
            options={{
              title: "Home",
              tabBarIcon: renderTabIcon(Home),
            }}
          />
          <Tab.Screen
            name="FavoriteTab"
            component={FavoriteStack}
            options={{
              title: "Favorites",
              tabBarIcon: renderTabIcon(Heart),
            }}
          />
        </Tab.Navigator>
      </View>
    </>
  );
};

export default MainTabs;
