import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import MainTabs from "./MainTabs";
// import StudentMainTabs from "@/src/navigation/StudentMainTabs";


export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Loading: undefined;
  Search:
    | { type?: "major" | "campus" | "all"; placeholder?: string }
    | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
};

export default function AppNavigator() {

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
          <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
