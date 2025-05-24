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
import { AntDesign } from "@expo/vector-icons";

//Cdnesdayomponents
import Screen from "../../components/Screen";

// apis
import apiClient from "../../apis/apiClient";

//config
import Colors from "../../config/Colors";
import { FontFamily } from "../../config/font";
import icons from "../../config/icons";

const NotificationScreen = ({ navigation }) => {
  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.leftIcon}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <AntDesign color={Colors.blacky} size={24} name={"arrowleft"} />
        </TouchableOpacity>

        <Text style={styles.title}>Notification</Text>

        {/* Invisible view to balance the layout */}
        <TouchableOpacity style={styles.rightIcon} activeOpacity={0.7}>
          <AntDesign color={Colors.blacky} size={24} name={"questioncircleo"} />
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

export default NotificationScreen;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  container: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: RFPercentage(1.5),
  },
  leftIcon: {
    width: 40, // same width as right placeholder to center text
    alignItems: "flex-start",
  },

  rightIcon: {
    width: 40, // keeps title centered
  },
  title: {
    textAlign: "center",
    color: Colors.blacky,
    fontFamily: FontFamily.medium,
    fontSize: RFPercentage(2),
  },
});
