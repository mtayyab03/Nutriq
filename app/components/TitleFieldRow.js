import React, { useState } from "react";
import { StyleSheet, View, Text, Platform, TextInput } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

//config
import Colors from "../config/Colors";
import { FontFamily } from "../config/font";

const TitleFieldRow = ({ title, placeholder, value, onChange }) => {
  return (
    <View style={styles.emailmain}>
      <Text
        style={{
          color: Colors.blacksuit,
          fontFamily: FontFamily.medium,
          fontSize: RFPercentage(1.7),
        }}
      >
        {title}
      </Text>
      <View style={{ width: "80%" }}>
        <TextInput
          style={{
            width: "100%",
            textAlign: "right", // Aligns both placeholder and text to the end
            fontFamily: FontFamily.regular,
            fontSize: RFPercentage(1.5),
          }}
          onChangeText={onChange}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={Colors.placeholder}
        />
      </View>
    </View>
  );
};

export default TitleFieldRow;

const styles = StyleSheet.create({
  emailmain: {
    width: "90%",
    height: RFPercentage(6.5),
    backgroundColor: Colors.textField,
    borderRadius: RFPercentage(1),
    color: Colors.blacky,
    paddingHorizontal: RFPercentage(2),
    marginTop: RFPercentage(1),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
