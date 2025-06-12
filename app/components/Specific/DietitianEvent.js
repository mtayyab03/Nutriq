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
import { MaterialIcons } from "@expo/vector-icons";

//config
import icons from "../../config/icons";
import Colors from "../../config/Colors";
import { FontFamily } from "../../config/font";

const DietitianEvent = ({ day, eventTitle, time, onPress }) => {
  const dateObj = new Date(day);
  const formattedMonth = dateObj.toLocaleString("default", { month: "short" }); // e.g., "May"
  const formattedDay = dateObj.getDate(); // e.g., 27
  return (
    <View
      style={{
        width: "90%",
        height: RFPercentage(11),
        backgroundColor: Colors.lightWhite,
        borderRadius: RFPercentage(1),
        marginTop: RFPercentage(1),
        padding: RFPercentage(1),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "80%",
        }}
      >
        <View
          style={{
            width: RFPercentage(9),
            height: RFPercentage(9),
            borderRadius: RFPercentage(1),
            backgroundColor: Colors.white,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: RFPercentage(0.1),
            borderColor: Colors.primary,
          }}
        >
          <Text
            style={{
              color: Colors.primary,
              fontFamily: FontFamily.medium,
              fontSize: RFPercentage(2.6),
              textAlign: "center",
            }}
          >
            {formattedMonth}
            {"\n"}
            {formattedDay}
          </Text>
        </View>
        <View style={{ marginLeft: RFPercentage(1.5) }}>
          <Text
            style={{
              color: Colors.blacky,
              fontFamily: FontFamily.medium,
              fontSize: RFPercentage(1.7),
            }}
          >
            {eventTitle}
          </Text>
          <Text
            style={{
              marginTop: RFPercentage(1),
              color: Colors.blacksuit,
              fontFamily: FontFamily.regular,
              fontSize: RFPercentage(1.3),
            }}
          >
            {time}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={{
          flexDirection: "row",
          width: RFPercentage(7),
          height: RFPercentage(3),
          backgroundColor: Colors.primary,
          borderRadius: RFPercentage(0.5),
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialIcons color={Colors.white} size={12} name={"edit"} />
        <Text
          style={{
            color: Colors.white,
            fontFamily: FontFamily.medium,
            fontSize: RFPercentage(1),
          }}
        >
          Manage
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DietitianEvent;
