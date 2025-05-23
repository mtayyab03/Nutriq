import React, { useState } from "react";
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  TextInput,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Octicons } from "@expo/vector-icons";

//config
import Colors from "../config/Colors";
import { FontFamily } from "../config/font";

export default function SearchField({ title, value, onChangeText }) {
  return (
    <View style={styles.searchmain}>
      <TextInput
        style={styles.inputtext}
        onChangeText={onChangeText}
        value={value}
        placeholder={title}
        placeholderTextColor={Colors.stroke}
      />
      <Octicons
        color={Colors.blacksuit}
        style={{ marginRight: RFPercentage(1) }}
        size={20}
        name={"search"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchmain: {
    width: "90%",
    padding: RFPercentage(1.2),
    paddingHorizontal: RFPercentage(2),
    borderRadius: RFPercentage(1.2),
    borderWidth: RFPercentage(0.1),
    borderColor: Colors.stroke,
    justifyContent: "center",
    marginTop: RFPercentage(2),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  inputtext: {
    fontSize: RFPercentage(1.6),
    color: Colors.blacky,
    fontFamily: FontFamily.regular,
  },
});
