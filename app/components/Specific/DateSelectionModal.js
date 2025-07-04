import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  ScrollView,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Feather } from "@expo/vector-icons";

//Cdnesdayomponents
import AppModal from "../common/AppModal";

//config
import Colors from "../../config/Colors";
import { FontFamily } from "../../config/font";
const DateSelectionModal = ({
  visible,
  setVisible,
  label,
  plans,
  onSelectDate,
}) => {
  return (
    <AppModal
      modalVisible={visible}
      setModalVisible={setVisible}
      style={{ alignItems: "center", justifyContent: "center" }}
      RecStyle={{
        width: "60%",
        padding: RFPercentage(2),
      }}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          setVisible(false);
        }}
        style={{
          width: "100%",
          justifyContent: "flex-end",
          alignItems: "flex-end",
        }}
      >
        <Feather name={"x"} size={22} color={Colors.blacksuit} />
      </TouchableOpacity>
      <Text
        style={{
          marginBottom: RFPercentage(1),
          color: Colors.primary,
          fontFamily: FontFamily.regular,
          fontSize: RFPercentage(2),
        }}
      >
        {label}
      </Text>
      {plans.map((plan) => (
        <TouchableOpacity
          key={plan.id}
          activeOpacity={0.7}
          onPress={() => {
            onSelectDate(plan.startingDate);
            setVisible(false);
          }}
        >
          <Text
            style={{
              marginVertical: 5,
              color: Colors.blacky,
              fontFamily: FontFamily.regular,
              fontSize: RFPercentage(1.5),
            }}
          >
            {plan.startingDate}
          </Text>
        </TouchableOpacity>
      ))}
    </AppModal>
  );
};

export default DateSelectionModal;
