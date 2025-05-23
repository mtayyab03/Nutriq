import React from "react";
import { Image, TouchableOpacity, StyleSheet, View, Text } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

//config
import icons from "../../config/icons";
import Colors from "../../config/Colors";
import { FontFamily } from "../../config/font";

const RadioButton = ({ options, selectedId, onChange }) => {
  return (
    <View
      style={{
        width: "90%",
        flexDirection: "row",
      }}
    >
      {options.map((item) => (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onChange(item.id)}
          key={item.id}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: RFPercentage(3),
          }}
        >
          <View
            style={{
              width: RFPercentage(2),
              height: RFPercentage(2),
              borderWidth: RFPercentage(0.2),
              borderColor: Colors.blacksuit,
              borderRadius: RFPercentage(3),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {selectedId === item.id ? (
              <View
                style={{
                  width: RFPercentage(1.2),
                  height: RFPercentage(1.2),
                  borderRadius: RFPercentage(3),
                  backgroundColor: Colors.blacksuit,
                }}
              />
            ) : null}
          </View>
          <Text
            style={{
              marginLeft: RFPercentage(1),
              color: Colors.blacky,
              fontFamily: FontFamily.regular,
              fontSize: RFPercentage(1.5),
            }}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RadioButton;
