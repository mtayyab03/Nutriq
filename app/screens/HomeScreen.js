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

//Cdnesdayomponents
import Screen from "../components/Screen";
import DatePicker from "../components/DatePicker";
import BarText from "../components/BarText";
import MealDef from "../components/Specific/MealDef";

// apis
import apiClient from "../apis/apiClient";

//config
import Colors from "../config/Colors";
import { FontFamily } from "../config/font";
import icons from "../config/icons";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "WEDNESDAY",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const HomeScreen = () => {
  const [mealData, setMealData] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchMealData = async () => {
      try {
        const response = await apiClient.get(
          "/client/company/1/meal-plans/183"
        );
        console.log("Meal plan data:", JSON.stringify(response.data, null, 2));

        // Ensure the API response is properly formatted before setting state
        if (response.data && Array.isArray(response.data.meals)) {
          setMealData(response.data.meals);
        } else {
          console.error("Unexpected API response format", response.data);
        }
      } catch (error) {
        console.error("Error fetching meal data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMealData();
  }, []);

  const currentDay = daysOfWeek[currentDayIndex].toUpperCase();

  const mealOrder = {
    BREAKFAST: 1,
    MID_MORNING_SNACK: 2,
    LUNCH: 3,
    AFTERNOON_SNACK: 4,
    DINNER: 5,
  };

  const filteredMeals = Array.isArray(mealData)
    ? mealData
        .filter((meal) => meal.day?.toUpperCase() === currentDay)
        .sort(
          (a, b) =>
            (mealOrder[a.mealTime] || 99) - (mealOrder[b.mealTime] || 99)
        )
    : [];

  // const filteredMeals = Array.isArray(mealData)
  //   ? mealData.filter((meal) => meal.day?.toUpperCase() === currentDay)
  //   : [];

  const availableDays = [
    ...new Set(mealData?.map((meal) => meal.day.toUpperCase()) || []),
  ];

  const missingDays = daysOfWeek.filter(
    (day) => !availableDays.includes(day.toUpperCase())
  );

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
        {filteredMeals.length > 0 ? (
          filteredMeals.map((meal, index) => {
            const foodNames =
              meal.foods && meal.foods.length > 0
                ? meal.foods.map((f) => f.food.name).join(", ")
                : null;

            const recipeNames =
              meal.recipes && meal.recipes.length > 0
                ? meal.recipes.map((r) => r.recipe.name).join(", ")
                : null;

            const hasData =
              foodNames || recipeNames || meal.note || meal.energyKcal;

            if (!hasData) return null; // Skip rendering if there's no data
            return (
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
                    <Text style={styles.rotText}>
                      {meal.mealTime.replace(/_/g, " ")}
                    </Text>
                  </View>
                </View>
                <View style={{ width: "100%", justifyContent: "center" }}>
                  {foodNames && (
                    <BarText barColor={Colors.primary} title={foodNames} />
                  )}

                  {recipeNames && (
                    <BarText barColor={Colors.brown} title={recipeNames} />
                  )}

                  {meal.note && (
                    <BarText barColor={Colors.purple} title={meal.note} />
                  )}
                  {meal.energyKcal && (
                    <View style={styles.CalContainer}>
                      <MaterialIcons
                        color={Colors.white}
                        size={18}
                        name={"electric-bolt"}
                      />
                      <Text style={styles.CalText}>{meal.energyKcal}</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })
        ) : (
          <Text
            style={{
              color: Colors.red,
              fontSize: 16,
              marginTop: RFPercentage(10),
            }}
          >
            No meals available for {currentDay}
          </Text>
        )}
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
    width: RFPercentage(18),
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
