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

//Cdnesdayomponents
import Screen from "../../components/Screen";

// apis
import apiClient from "../../apis/apiClient";

//config
import Colors from "../../config/Colors";
import { FontFamily } from "../../config/font";
import icons from "../../config/icons";

const DiscoverScreen = ({ navigation }) => {
  const [selected, setSelected] = useState("All");

  const categories = [
    "All",
    "Breakfast",
    "Mid Morning Snack",
    "Lunch",
    "Afternoon Snack",
    "Dinner",
  ];

  const foodItems = [
    {
      id: 1,
      image: icons.saladimg,
      title: "Apple Crisp",
      description: "It is a warm, comforting dessert made with apple & ...",
      category: "Breakfast",
    },
    {
      id: 2,
      image: icons.saladimg,
      title: "Chicken Salad",
      description: "A healthy and delicious mix of chicken and greens.",
      category: "Mid morning Snack",
    },
    {
      id: 3,
      image: icons.saladimg,
      title: "Fruit Bowl",
      description: "A fresh mix of seasonal fruits perfect for snacks.",
      category: "Lunch",
    },
    {
      id: 4,
      image: icons.saladimg,
      title: "Veggie Delight",
      description: "Loaded with vegetables and flavors to energize you.",
      category: "Dinner",
    },
    {
      id: 5,
      image: icons.saladimg,
      title: "Russian Salad",
      description: "A fresh mix of seasonal fruits perfect for snacks.",
    },
    {
      id: 6,
      image: icons.saladimg,
      title: "Delight Yum",
      description: "Loaded with vegetables and flavors to energize you.",
      category: "Afternoon Snack",
    },
  ];
  const filteredItems =
    selected.toLowerCase() === "all"
      ? foodItems
      : foodItems.filter(
          (item) =>
            item.category &&
            item.category.toLowerCase() === selected.toLowerCase()
        );

  return (
    <Screen style={styles.screen}>
      <View style={{ width: "90%", marginTop: RFPercentage(1) }}>
        <Text
          style={{
            color: Colors.blacky,
            fontFamily: FontFamily.medium,
            fontSize: RFPercentage(2.3),
          }}
        >
          Recipies
        </Text>
      </View>

      {/* category */}
      <View
        style={{
          width: "100%",
          marginVertical: RFPercentage(2),
        }}
      >
        <ScrollView
          style={{ width: "100%" }}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            marginLeft: RFPercentage(2),
            paddingRight: RFPercentage(2),
          }}
        >
          {categories.map((item) => (
            <TouchableOpacity
              activeOpacity={0.7}
              key={item}
              onPress={() => setSelected(item)}
              style={[
                styles.button,
                {
                  backgroundColor:
                    selected === item ? Colors.primary : "transparent",
                  borderColor:
                    selected === item ? Colors.primary : Colors.stroke,
                },
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: selected === item ? Colors.white : Colors.blacksuit,
                  },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* recipies */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
      >
        <View
          style={{
            width: "90%",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {filteredItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() => navigation.navigate("RecipieScreen")}
              style={{
                width: "48%",
                borderWidth: 1,
                borderColor: Colors.stroke,
                padding: RFPercentage(1),
                borderRadius: RFPercentage(1),
                alignItems: "center",
                justifyContent: "center",
                marginVertical: RFPercentage(0.7),
              }}
            >
              <Image
                style={{
                  width: RFPercentage(18),
                  height: RFPercentage(15),
                  borderRadius: RFPercentage(1),
                }}
                source={item.image}
                resizeMode="cover"
              />
              <View style={{ width: "100%" }}>
                <Text
                  style={{
                    marginTop: RFPercentage(0.5),
                    color: Colors.blacky,
                    fontFamily: FontFamily.medium,
                    fontSize: RFPercentage(1.8),
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    marginTop: RFPercentage(0.5),
                    color: Colors.blacksuit,
                    fontFamily: FontFamily.regular,
                    fontSize: RFPercentage(1.2),
                  }}
                >
                  {item.description.split(" ").slice(0, 10).join(" ") +
                    (item.description.split(" ").length > 10 ? " ..." : "")}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
};

export default DiscoverScreen;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  scrollContent: {
    paddingBottom: RFPercentage(5),
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    paddingVertical: RFPercentage(1),
    paddingHorizontal: RFPercentage(2.5),
    borderRadius: RFPercentage(3),
    borderWidth: 1,
    marginRight: RFPercentage(1.5),
  },
  buttonText: {
    fontSize: RFPercentage(1.5),
    fontFamily: FontFamily.regular,
  },
});
