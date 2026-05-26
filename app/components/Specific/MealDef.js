import React from "react";
import { Image, TouchableOpacity, StyleSheet, View, Text } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

//config
import Colors from "../../config/Colors";
import { FontFamily } from "../../config/font";

const MealDef = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        width: "90%",
        marginTop: RFPercentage(2),
        justifyContent: "space-between",
      }}
    >
      <View style={styles.ingdCotainer}>
        <View
          style={{
            width: RFPercentage(1.3),
            height: RFPercentage(1.3),
            borderRadius: 1,
            backgroundColor: Colors.primary,
          }}
        />
        <Text style={styles.ingredientText}>Foods</Text>
      </View>
      <View style={styles.ingdCotainer}>
        <View
          style={{
            width: RFPercentage(1.3),
            height: RFPercentage(1.3),
            borderRadius: 1,
            backgroundColor: Colors.brown,
          }}
        />
        <Text style={styles.ingredientText}>Recipes</Text>
      </View>
      <View style={styles.ingdCotainer}>
        <View
          style={{
            width: RFPercentage(1.3),
            height: RFPercentage(1.3),
            borderRadius: 1,
            backgroundColor: Colors.purple,
          }}
        />
        <Text style={styles.ingredientText}>Notes</Text>
      </View>
    </View>
  );
};

export default MealDef;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  ingredientText: {
    marginLeft: RFPercentage(1),
    color: Colors.blacksuit, // Use a different color
    fontFamily: FontFamily.regular,
    fontSize: RFPercentage(1.4), // Slightly bigger if preferred
  },
  ingdCotainer: { flexDirection: "row", alignItems: "center" },
});
