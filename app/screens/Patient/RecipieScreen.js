import React, { useState, useEffect } from "react";
import { Image, StyleSheet, View, Text, ScrollView } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { MaterialCommunityIcons } from "@expo/vector-icons";

//Components
import Screen from "../../components/Screen";
import CommonHeader from "../../components/common/CommonHeader";
import AppLoading from "../../components/AppLoading";

// apis
import apiClient from "../../apis/apiClient";

//config
import icons from "../../config/icons";
import Colors from "../../config/Colors";
import { FontFamily } from "../../config/font";

const RecipieScreen = ({ navigation, route }) => {
  const { recipeId, companyId, imageRecipe } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await apiClient.get(
          `/client/company/${companyId}/recipes/${recipeId}`
        );
        if (response.status === 200) {
          setRecipe(response.data);
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        setLoading(false); // ✅ Stop loading
      }
    };

    fetchRecipe();
  }, [companyId, recipeId]);

  if (loading) {
    return <AppLoading />;
  }

  if (!recipe) {
    return (
      <Screen style={styles.screen}>
        <CommonHeader title="Recipie" onBackPress={() => navigation.goBack()} />
        <Text
          style={{
            textAlign: "center",
            marginTop: RFPercentage(5),
            fontFamily: FontFamily.medium,
            fontSize: RFPercentage(2),
            color: Colors.red,
          }}
        >
          Failed to load recipe.
        </Text>
      </Screen>
    );
  }

  return (
    <Screen style={styles.screen}>
      <CommonHeader title="Recipie" onBackPress={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
        }}
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
        bounces={false} // iOS only: disables bounce
        overScrollMode="never" // Android only: disables overscroll glow
      >
        {imageRecipe && (
          <Image
            style={{
              width: "90%",
              height: RFPercentage(30),
              borderRadius: RFPercentage(2),
              marginTop: RFPercentage(2),
            }}
            source={imageRecipe}
            resizeMode="cover"
          />
        )}
        <View style={styles.mainContainer}>
          <View style={{ width: "50%" }}>
            <Text
              style={{
                color: Colors.blacky,
                fontFamily: FontFamily.medium,
                fontSize: RFPercentage(2.3),
              }}
            >
              {recipe.name}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View style={styles.smallContainer}>
                <MaterialCommunityIcons
                  color={Colors.blacky}
                  size={18}
                  name={"clock-time-four-outline"}
                />
                <Text style={styles.smallText}>Time</Text>
              </View>
              <Text style={styles.TextOffer}>
                {recipe.preparationTimeInMinutes} min
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
            <View style={styles.smallContainer}>
              <Image
                style={{
                  width: RFPercentage(1.8),
                  height: RFPercentage(1.8),
                }}
                source={icons.serve}
              />
              <Text style={styles.smallText}>Servings</Text>
            </View>
            <Text style={styles.TextOffer}>{recipe.servings} servings</Text>
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
          <Text style={styles.nutritionText}>
            E: {recipe.macros.total.energyKcal.toFixed(3)}kcal
          </Text>
          <Text style={styles.nutritionText}>
            C: {recipe.macros.total.carbs.toFixed(3)}g
          </Text>
          <Text style={styles.nutritionText}>
            P: {recipe.macros.total.protein.toFixed(3)}g
          </Text>
          <Text style={styles.nutritionText}>
            F: {recipe.macros.total.fat.toFixed(3)}g
          </Text>
        </View>

        <View style={{ width: "90%", marginTop: RFPercentage(1) }}>
          <View style={[styles.macroContainer, { width: "40%" }]}>
            <Text style={styles.macroText}>Ingredients</Text>
          </View>
        </View>
        {recipe.ingredients.map((item, index) => (
          <View key={index} style={styles.bulletContainer}>
            <Text style={styles.dotText}>•</Text>
            <Text style={styles.textBullet}>{item.food.name}</Text>
          </View>
        ))}

        <View style={{ width: "90%", marginTop: RFPercentage(1) }}>
          <View style={[styles.macroContainer, { width: "40%" }]}>
            <Text style={styles.macroText}>Directions</Text>
          </View>

          <Text style={styles.textBullet}>
            {recipe.preparationInstructions}
          </Text>
        </View>
      </ScrollView>
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
  mainContainer: {
    width: "90%",
    marginTop: RFPercentage(2),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
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
  smallText: {
    marginLeft: RFPercentage(0.5),
    color: Colors.blacky,
    fontFamily: FontFamily.regular,
    fontSize: RFPercentage(1.5),
  },
  TextOffer: {
    marginTop: RFPercentage(0.5),
    color: Colors.blacksuit,
    fontFamily: FontFamily.regular,
    fontSize: RFPercentage(1.2),
  },
  smallContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
