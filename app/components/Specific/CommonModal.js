import React from "react";
import { Image, TouchableOpacity, StyleSheet, View, Text } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Fontisto } from "@expo/vector-icons";

//Components
import AppModal from "../../components/common/AppModal";

//config
import icons from "../../config/icons";
import Colors from "../../config/Colors";
import { FontFamily } from "../../config/font";
const CommonModal = ({
  isModalVisible,
  setIsModalVisible,
  image,
  title,
  buttonpri,
  buttonsec,
  onpressPri,
  onpressSec,
}) => {
  return (
    <AppModal
      modalVisible={isModalVisible}
      setModalVisible={setIsModalVisible}
      style={{ alignItems: "center", justifyContent: "center" }}
    >
      {/* Image at top */}
      <Image
        source={image} // Replace with your image path
        style={{ width: 80, height: 80, marginBottom: 20 }}
        resizeMode="contain"
      />

      {/* Title text */}
      <Text
        style={{
          fontFamily: FontFamily.regular,
          fontSize: RFPercentage(2),
          marginBottom: RFPercentage(4),
          textAlign: "center",
        }}
      >
        {title}
      </Text>

      {/* Buttons row */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <TouchableOpacity
          onPress={onpressPri}
          style={{
            backgroundColor: Colors.primary,
            paddingVertical: 13,
            paddingHorizontal: 20,
            borderRadius: 10,
            marginRight: 10,
            flex: 1,
            alignItems: "center",
          }}
        >
          <Text style={{ color: Colors.white, fontFamily: FontFamily.regular }}>
            {buttonpri}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onpressSec}
          style={{
            backgroundColor: Colors.lightWhite,
            paddingVertical: 13,
            paddingHorizontal: 20,
            borderRadius: 10,
            flex: 1,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: Colors.blacktext,
              fontFamily: FontFamily.regular,
            }}
          >
            {buttonsec}
          </Text>
        </TouchableOpacity>
      </View>
    </AppModal>
  );
};

export default CommonModal;
