import React, { useState, useEffect } from "react";
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { MaterialIcons } from "@expo/vector-icons";

//Components
import Screen from "../components/Screen";
import DatePicker from "../components/DatePicker";

//config
import Colors from "../config/Colors";
import { FontFamily } from "../config/font";
import BarText from "../components/BarText";
import MealDef from "../components/Specific/MealDef";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const HomeScreen = () => {
  const [date, setDate] = useState("");
  const [error, setError] = useState({ date: false });

  const handleDateChange = (formattedDate) => {
    setDate(formattedDate);
    console.log("Selected Date:", formattedDate);
  };
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  const handlePreviousDay = () => {
    setCurrentDayIndex((prevIndex) =>
      prevIndex === 0 ? daysOfWeek.length - 1 : prevIndex - 1
    );
  };

  const handleNextDay = () => {
    setCurrentDayIndex((prevIndex) =>
      prevIndex === daysOfWeek.length - 1 ? 0 : prevIndex + 1
    );
  };

  const mealData = [
    {
      mealType: "Breakfast",
      foods: "Grilled Chicken with Avocado Salad",
      recipe: null,
      notes: "Check for organic options",
      calories: "2100 Kcal",
    },
    {
      mealType: "Morning Snack",
      foods: "Mango and Grapes (2 pieces)",
      recipe: "Prepare a smoothie with almond milk",
      notes: null,
      calories: "2500 Kcal",
    },
    {
      mealType: "Afternoon Snack",
      foods: "Orange and Strawberries (3 pieces)",
      recipe: null,
      notes: null,
      calories: "2200 Kcal",
    },
    {
      mealType: "Lunch",
      foods: "Grilled Chicken with Avocado Salad",
      recipe: "Marinate chicken with spices, grill it & serve with salad",
      notes: "Use olive oil for dressing",
      calories: "1800 Kcal",
    },
    {
      mealType: "Dinner",
      foods: "Steamed Salmon with Quinoa",
      recipe: null,
      notes: "Pair with green veggies",
      calories: "1600 Kcal",
    },
  ];

  const MealDays = [
    {
      day: "Monday",
    },
    {
      day: "Tuesday",
    },
    {
      day: "Wedesday",
    },
    {
      day: "Thursday",
    },
    { day: "Friday" },
    {
      day: "Saturday",
    },
    { day: "Sunnday" },
  ];

  return (
    <Screen style={styles.screen}>
      <View
        style={{
          width: "90%",
          flexDirection: "row",
          alignItems: "flex-start",
          marginTop: RFPercentage(1),
        }}
      >
        <View
          style={{
            width: "50%",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <Text
            style={{
              color: Colors.primary,
              fontFamily: FontFamily.medium,
              fontSize: RFPercentage(3),
            }}
          >
            Hello 👋{"\n"}
            <Text
              style={{
                color: Colors.blacksuit, // Use a different color
                fontFamily: FontFamily.medium,
                fontSize: RFPercentage(3), // Slightly bigger if preferred
              }}
            >
              Anaya Nilson
            </Text>
          </Text>
        </View>
        <View
          style={{
            width: "50%",
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
        >
          <Text
            style={{
              color: Colors.blacksuit, // Use a different color
              fontFamily: FontFamily.medium,
              fontSize: RFPercentage(1.2), // Slightly bigger if preferred
            }}
          >
            Company Name
          </Text>
          <Text
            style={{
              marginTop: RFPercentage(0.7),
              color: Colors.primary, // Use a different color
              fontFamily: FontFamily.medium,
              fontSize: RFPercentage(1.7), // Slightly bigger if preferred
            }}
          >
            Greece Meal LTD.
          </Text>
        </View>
      </View>

      {/* date picker */}

      <View
        style={{
          flexDirection: "row",
          width: "90%",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <DatePicker
          label="Starting Date"
          placeholder="YYYY-MM-DD"
          onDateChange={handleDateChange}
          error={error}
          setError={setError}
        />
        <DatePicker
          label="Ending Date"
          placeholder="YYYY-MM-DD"
          onDateChange={handleDateChange}
          error={error}
          setError={setError}
        />
      </View>

      <MealDef />
      {/* navigation days */}

      <View style={styles.daysContainer}>
        <TouchableOpacity
          onPress={handlePreviousDay}
          activeOpacity={0.7}
          style={[
            styles.iconleftContainer,
            {
              paddingLeft: RFPercentage(1),
            },
          ]}
        >
          <MaterialIcons
            color={Colors.white}
            size={28}
            name={"arrow-back-ios"}
          />
        </TouchableOpacity>

        <View>
          <Text style={styles.daysText}>{daysOfWeek[currentDayIndex]}</Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginRight: RFPercentage(0.5),
            }}
          >
            <MaterialIcons
              color={Colors.orange}
              size={18}
              name={"electric-bolt"}
            />
            <Text
              style={{
                marginLeft: RFPercentage(0.5),
                color: Colors.orange, // Use a different color
                fontFamily: FontFamily.regular,
                fontSize: RFPercentage(1.2), // Slightly bigger if preferred
              }}
            >
              3019 Kcal
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={handleNextDay}
          activeOpacity={0.7}
          style={styles.iconleftContainer}
        >
          <MaterialIcons
            color={Colors.white}
            size={28}
            name={"arrow-forward-ios"}
          />
        </TouchableOpacity>
      </View>

      {/* Meal details  */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          paddingBottom: RFPercentage(4),
        }}
      >
        {mealData.map((meal, index) => (
          <View
            key={index}
            style={{
              width: "90%",
              marginTop: RFPercentage(2),
              flexDirection: "row",
            }}
          >
            <View style={styles.rotContainer}>
              <View style={styles.rotationCon}>
                <Text style={styles.rotText}>{meal.mealType}</Text>
              </View>
            </View>
            <View style={{ width: "100%", justifyContent: "center" }}>
              {meal.foods && (
                <BarText barColor={Colors.primary} title={meal.foods} />
              )}

              {meal.recipe && (
                <BarText barColor={Colors.brown} title={meal.recipe} />
              )}

              {meal.notes && (
                <BarText barColor={Colors.purple} title={meal.notes} />
              )}
              {meal.calories && (
                <View style={styles.CalContainer}>
                  <MaterialIcons
                    color={Colors.white}
                    size={18}
                    name={"electric-bolt"}
                  />
                  <Text style={styles.CalText}>{meal.calories}</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
      {/* meal detaile end */}
    </Screen>
  );
};

export default HomeScreen;
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
  rotContainer: {
    backgroundColor: Colors.lwhite, // Set background color
    width: RFPercentage(3), // Width of the container (matches the height of the rotated text)
    height: RFPercentage(14),
    justifyContent: "center", // Center the text vertically
    alignItems: "center", // Center the text horizontally
    borderRadius: RFPercentage(0.3),
    marginRight: RFPercentage(1.5),
  },
  rotationCon: {
    transform: [{ rotate: "-90deg" }], // Rotate the inner view
    width: RFPercentage(12), // Width of the rotated content
    height: RFPercentage(3), // Height of the rotated content
    justifyContent: "center",
    alignItems: "center",
  },
  rotText: {
    color: Colors.blacksuit,
    fontFamily: FontFamily.medium,
    fontSize: RFPercentage(1.2),
  },
  CalContainer: {
    width: RFPercentage(9),
    paddingVertical: RFPercentage(0.2),
    borderRadius: RFPercentage(0.7),
    marginTop: RFPercentage(0.5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.orange,
  },
  CalText: {
    marginLeft: RFPercentage(0.3),
    color: Colors.white, // Use a different color
    fontFamily: FontFamily.regular,
    fontSize: RFPercentage(1.2), // Slightly bigger if preferred
  },
  iconleftContainer: {
    width: RFPercentage(7),
    height: RFPercentage(5),
    borderRadius: RFPercentage(1),
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  daysText: {
    marginTop: RFPercentage(0.7),
    color: Colors.blacksuit, // Use a different color
    fontFamily: FontFamily.medium,
    fontSize: RFPercentage(2.8), // Slightly bigger if preferred
  },
  daysContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    marginTop: RFPercentage(3),
  },
});
