import React from "react";
import { Image, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { RFPercentage } from "react-native-responsive-fontsize";
import {
  Fontisto,
  Entypo,
  Feather,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  EvilIcons,
} from "@expo/vector-icons";

//screens
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import DiscoverScreen from "../screens/Patient/DiscoverScreen";
import ProgressScreen from "../screens/Patient/ProgressScreen";
//config
import Colors from "../config/Colors";

const Tab = createBottomTabNavigator();

export default function BottomTab() {
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.lightgrey,
        headerShown: false,
        tabBarStyle: {
          height: wp("18%"),
          padding: 5,
          paddingBottom: RFPercentage(2),
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: Colors.white,
        },
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: "Plan",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="calendar-check"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tab.Screen
        name="DiscoverScreen"
        component={DiscoverScreen}
        options={{
          tabBarLabel: "Discover",
          tabBarIcon: ({ color, size }) => (
            <Feather name="search" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="ProgressScreen"
        component={ProgressScreen}
        options={{
          tabBarLabel: "Progress",
          tabBarIcon: ({ color, size }) => (
            <EvilIcons name="chart" color={color} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  activeIcon: {
    width: RFPercentage(6),
    height: RFPercentage(6),
    backgroundColor: Colors.third,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});
