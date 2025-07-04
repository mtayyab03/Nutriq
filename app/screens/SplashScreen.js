import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import AsyncStorage from "@react-native-async-storage/async-storage";

// apis
import apiClient from "../apis/apiClient";

//configs
import Colors from "../config/Colors";
import { FontFamily } from "../config/font";
import icons from "../config/icons";

export default function SplashScreen(props) {
  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");

        if (token) {
          // Try to fetch user profile
          const profileRes = await apiClient.get("/users/profile");
          const { role } = profileRes.data;
          console.log("Profile data:", profileRes.data);

          if (role === "CLIENT") {
            props.navigation.reset({
              index: 0,
              routes: [{ name: "BottomTab", params: { screen: "HomeScreen" } }],
            });
          } else if (role === "BASIC_PROF") {
            props.navigation.reset({
              index: 0,
              routes: [{ name: "CalendarEvent" }],
            });
          } else {
            // Unknown role: fallback to login
            props.navigation.navigate("LoginScreen");
          }
        } else {
          props.navigation.navigate("LoginScreen");
        }
      } catch (error) {
        props.navigation.navigate("LoginScreen");
      }
    };

    const timer = setTimeout(() => {
      checkAuthAndNavigate(); // run after 2.5 sec
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <View style={styles.background}>
      <TouchableOpacity activeOpacity={0.7}>
        <Image
          style={{ width: RFPercentage(30), height: RFPercentage(30) }}
          source={icons.nutriqlogo}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
