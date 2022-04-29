import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MarketScreen from "../screens/MarketScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import AddNewAssetsScreen from "../screens/AddNewAssetsScreen";
import StockDetailsScreen from "../screens/StockDetailsScreen";
import { useRoute } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Root"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddNewAssetsScreen"
        component={AddNewAssetsScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#181818" },
          headerTitleStyle: { color: "white", fontWeight: "bold" },
          headerTitle: "新增股票",
        }}
      />
      <Stack.Screen name="StockDetailsScreen" component={StockDetailsScreen} />
    </Stack.Navigator>
  );
};

export default Navigation;

const styles = StyleSheet.create({});
