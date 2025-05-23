import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons"; // Use @expo/vector-icons if using Expo
import { RFPercentage } from "react-native-responsive-fontsize";
//config
import icons from "../../config/icons";
import Colors from "../../config/Colors";
import { FontFamily } from "../../config/font";

const CommonHeader = ({ title, onBackPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.leftIcon}
        activeOpacity={0.7}
        onPress={onBackPress}
      >
        <AntDesign color={Colors.blacky} size={24} name={"arrowleft"} />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      {/* Invisible view to balance the layout */}
      <View style={styles.rightPlaceholder} />
    </View>
  );
};

const styles = StyleSheet.create({
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
  rightPlaceholder: {
    width: 40, // keeps title centered
  },
  title: {
    textAlign: "center",
    color: Colors.blacky,
    fontFamily: FontFamily.medium,
    fontSize: RFPercentage(2),
  },
});
export default CommonHeader;
