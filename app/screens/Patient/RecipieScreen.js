import React, { useState, useEffect } from "react";
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import {
  Ionicons,
  Fontisto,
  MaterialCommunityIcons,
  AntDesign,
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";

//Components
import Screen from "../../components/Screen";
import CommonHeader from "../../components/common/CommonHeader";

// apis
import apiClient from "../../apis/apiClient";

//config
import icons from "../../config/icons";
import Colors from "../../config/Colors";
import { FontFamily } from "../../config/font";

const RecipieScreen = ({ navigation }) => {
  return (
    <Screen style={styles.screen}>
      <CommonHeader title="Recipie" onBackPress={() => navigation.goBack()} />

      <Image
        style={{
          width: "90%",
          height: RFPercentage(30),
          borderRadius: RFPercentage(2),
          marginTop: RFPercentage(2),
        }}
        source={icons.saladimg}
        resizeMode="cover"
      />
      <View
        style={{
          width: "90%",
          marginTop: RFPercentage(2),
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Text
          style={{
            color: Colors.blacky,
            fontFamily: FontFamily.medium,
            fontSize: RFPercentage(2.3),
          }}
        >
          Apple Crisp
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialCommunityIcons
                color={Colors.blacky}
                size={18}
                name={"clock-time-four-outline"}
              />
              <Text
                style={{
                  marginLeft: RFPercentage(0.5),
                  color: Colors.blacky,
                  fontFamily: FontFamily.regular,
                  fontSize: RFPercentage(1.5),
                }}
              >
                Time
              </Text>
            </View>
            <Text
              style={{
                marginTop: RFPercentage(0.5),
                color: Colors.blacksuit,
                fontFamily: FontFamily.regular,
                fontSize: RFPercentage(1.2),
              }}
            >
              45min
            </Text>
          </View>
        </View>

        <View
          style={{
            marginLeft: RFPercentage(2),
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              style={{
                width: RFPercentage(1.8),
                height: RFPercentage(1.8),
              }}
              source={icons.serve}
            />
            <Text
              style={{
                marginLeft: RFPercentage(0.5),
                color: Colors.blacky,
                fontFamily: FontFamily.regular,
                fontSize: RFPercentage(1.5),
              }}
            >
              Servings
            </Text>
          </View>
          <Text
            style={{
              marginTop: RFPercentage(0.5),
              color: Colors.blacksuit,
              fontFamily: FontFamily.regular,
              fontSize: RFPercentage(1.2),
            }}
          >
            7 servings
          </Text>
        </View>
      </View>

      <View style={styles.macroContainer}>
        <Text style={styles.macroText}>Macros</Text>
      </View>
      <View
        style={{
          width: "90%",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.nutritionText}>E: 1509.005kcal</Text>
        <Text style={styles.nutritionText}>C: 110989.005g</Text>
        <Text style={styles.nutritionText}>P: 289.87g</Text>
        <Text style={styles.nutritionText}>F: 130.8734398g</Text>
      </View>

      <View style={{ width: "90%", marginTop: RFPercentage(1) }}>
        <View style={[styles.macroContainer, { width: "40%" }]}>
          <Text style={styles.macroText}>Ingredients</Text>
        </View>
      </View>

      <View style={styles.bulletContainer}>
        <Text style={styles.dotText}>•</Text>
        <Text style={styles.textBullet}>
          Fresh apples (e.g., Granny Smith or Honeycrisp)
        </Text>
      </View>

      <View style={styles.bulletContainer}>
        <Text style={styles.dotText}>•</Text>
        <Text style={styles.textBullet}>Brown sugar</Text>
      </View>
      <View style={styles.bulletContainer}>
        <Text style={styles.dotText}>•</Text>
        <Text style={styles.textBullet}>Granulated sugar</Text>
      </View>
      <View style={styles.bulletContainer}>
        <Text style={styles.dotText}>•</Text>
        <Text style={styles.textBullet}>Ground nutmeg (optional)</Text>
      </View>

      <View style={{ width: "90%", marginTop: RFPercentage(1) }}>
        <View style={[styles.macroContainer, { width: "40%" }]}>
          <Text style={styles.macroText}>Directions</Text>
        </View>

        <Text style={styles.textBullet}>
          Execution: We put 2 tablespoons of olive oil with the onion in the pan
          over high heat to soften.
        </Text>
      </View>
    </Screen>
  );
};

export default RecipieScreen;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  nutritionText: {
    color: Colors.blacky,
    fontFamily: FontFamily.regular,
    fontSize: RFPercentage(1.3),
  },
  macroContainer: {
    width: "90%",
    paddingVertical: RFPercentage(1),
    alignItems: "center",
    justifyContent: "center",
    marginVertical: RFPercentage(2),
    backgroundColor: Colors.blacky,
    borderRadius: RFPercentage(1),
  },
  macroText: {
    color: Colors.white,
    fontFamily: FontFamily.regular,
    fontSize: RFPercentage(2),
  },
  bulletContainer: { width: "90%", flexDirection: "row", alignItems: "center" },
  dotText: {
    color: Colors.blacky,
    fontFamily: FontFamily.regular,
    fontSize: RFPercentage(2.5), // Bigger dot
    marginRight: 6,
  },
  textBullet: {
    color: Colors.blacky,
    fontFamily: FontFamily.regular,
    fontSize: RFPercentage(1.5),
  },
});
