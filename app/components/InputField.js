import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  TextInput,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

//config
import Colors from "../config/Colors";
import { FontFamily } from "../config/font";

export default function InputField({ title, placeTitle, value, onChange }) {
  return (
    <>
      <View style={{ width: "90%", marginTop: RFPercentage(1) }}>
        <Text
          style={{
            color: Colors.blacksuit,
            fontFamily: FontFamily.regular,
            fontSize: RFPercentage(1.6),
          }}
        >
          {title}
        </Text>
      </View>

      <View style={styles.emailmain}>
        <TextInput
          onChangeText={onChange}
          value={value}
          placeholder={placeTitle}
          placeholderTextColor={Colors.stroke}
        />
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  emailmain: {
    width: "90%",
    padding: RFPercentage(1.5),
    // backgroundColor: Colors.bgwhite,
    borderWidth: RFPercentage(0.1),
    borderRadius: RFPercentage(1),
    borderColor: Colors.stroke,
    color: Colors.blacky,
    paddingHorizontal: RFPercentage(1.5),
    justifyContent: "center",
    marginTop: RFPercentage(1),
  },
  input: { fontFamily: FontFamily.regular },
});
