import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MarketScreen from "../../screens/MarketScreen";
import { MaterialIcons } from "@expo/vector-icons";
import PortfolioScreen from "../../screens/PortfolioScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import WatchListScreen from "../../screens/WatchListScreen";
import { AntDesign } from "@expo/vector-icons";
const Tab = createBottomTabNavigator();
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: { backgroundColor: "#181818" },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "grey",
        headerStyle: { backgroundColor: "#181818" },
        headerTitleStyle: { color: "white", fontWeight: "bold" },
      }}
    >
      <Tab.Screen
        name="Market"
        component={MarketScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <MaterialIcons
              name="storefront"
              size={focused ? 30 : 25}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Portfolio"
        component={PortfolioScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              name="chart-arc"
              size={focused ? 30 : 25}
              color={color}
            />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="WatchList"
        component={WatchListScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <AntDesign name="staro" size={focused ? 30 : 25} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;

const styles = StyleSheet.create({});
