import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

//config
import icons from "../config/icons";
import Colors from "../config/Colors";
import { FontFamily } from "../config/font";

const BarText = ({ barColor, title }) => {
  return (
    <View
      style={{
        width: "85%",
        // height: RFPercentage(3),
        borderRadius: RFPercentage(1),
        borderWidth: RFPercentage(0.1),
        borderColor: barColor,
        flexDirection: "row",
        alignItems: "center",
        marginTop: RFPercentage(0.5),
      }}
    >
      <View
        style={{
          width: RFPercentage(1),
          height: "100%",
          justifyContent: "center", // Center the text vertically
          backgroundColor: barColor,
          marginRight: RFPercentage(1),
          borderTopLeftRadius: RFPercentage(1),
          borderBottomLeftRadius: RFPercentage(1),
        }}
      />

      <Text
        style={{
          marginVertical: RFPercentage(0.5),
          color: Colors.blacksuit,
          fontFamily: FontFamily.medium,
          fontSize: RFPercentage(1.2),
        }}
      >
        {title}
      </Text>
    </View>
  );
};

export default BarText;
