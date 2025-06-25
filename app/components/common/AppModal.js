import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, View, Modal } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

//config
import Colors from "../../config/Colors";

export default function AppModal({
  children,
  modalVisible,
  setModalVisible,
  style,
  RecStyle,
}) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
    >
      <View
        style={[
          {
            flex: 1,
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          },
          style,
        ]}
      >
        <View
          style={[
            {
              width: "80%",
              backgroundColor: "white",
              borderRadius: 20,
              padding: 35,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            },
            RecStyle,
          ]}
        >
          {children}
        </View>
      </View>
    </Modal>
  );
}
