import React, { useState, useEffect } from "react";
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  ScrollView,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import LottieView from "lottie-react-native";

//Cdnesdayomponents
import Screen from "../../components/Screen";
import AppLoading from "../../components/AppLoading";
import NutrientsChartCard from "../../components/Specific/NutrientsChartCard";
import DualProgressCircles from "../../components/Specific/DualProgressCircles";

// apis
import apiClient from "../../apis/apiClient";

//config
import Colors from "../../config/Colors";
import { FontFamily } from "../../config/font";
import icons from "../../config/icons";

const ProgressScreen = () => {
  return (
    <Screen style={styles.screen}>
      <Text>Progress Screen</Text>
    </Screen>
  );
};

export default ProgressScreen;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
});
