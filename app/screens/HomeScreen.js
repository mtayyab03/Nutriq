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
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

//Cdnesdayomponents
import Screen from "../components/Screen";
import DatePicker from "../components/DatePicker";
import BarText from "../components/BarText";
import MealDef from "../components/Specific/MealDef";
import DateSelectionModal from "../components/Specific/DateSelectionModal";
import AppLoading from "../components/AppLoading";

// apis
import apiClient from "../apis/apiClient";

//config
import Colors from "../config/Colors";
import { FontFamily } from "../config/font";
import icons from "../config/icons";

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
  const [mealData, setMealData] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [surName, setSurName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [startingDate, setStartingDate] = useState("null");
  const [endingDate, setEndingDate] = useState("null");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [allMealPlans, setAllMealPlans] = useState([]);
  const [firstPlanId, setFirstPlanId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
    const fetchUserProfile = async () => {
      try {
        const response = await apiClient.get("/users/profile");
        const userData = response.data;

        setFirstName(userData.firstName || "");
        setSurName(userData.lastName || "");
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchMealData = async () => {
      setLoading(true); // 👈 Start loading here
      try {
        const companyResponse = await apiClient.get("/client/companies");

        if (companyResponse.data?.length > 0) {
          const { id: companyId, name } = companyResponse.data[0];
          setCompanyId(companyId);
          setCompanyName(name);

          console.log(`Fetching meals for Company: ${name} (ID: ${companyId})`);

          const mealPlanResponse = await apiClient.get(
            `/client/company/${companyId}/meal-plans`
          );

          if (Array.isArray(mealPlanResponse.data)) {
            const mealPlans = mealPlanResponse.data;

            const formattedPlans = mealPlans.map((plan) => ({
              id: plan.id,
              startingDate: plan.startingDate
                ? new Date(plan.startingDate).toISOString().split("T")[0]
                : null,
              endingDate: plan.endingDate
                ? new Date(plan.endingDate).toISOString().split("T")[0]
                : null,
            }));

            setAllMealPlans(formattedPlans);

            // Select first plan by default
            const firstPlan = formattedPlans[0];
            setStartingDate(firstPlan?.startingDate ?? null);
            setEndingDate(firstPlan?.endingDate ?? null);
            setFirstPlanId(firstPlan?.id ?? null);

            // Fetch meals for first plan
            const response = await apiClient.get(
              `/client/company/${companyId}/meal-plans/${firstPlan.id}`
            );

            if (Array.isArray(response.data?.meals)) {
              setMealData(response.data.meals);
            } else {
              console.error("Unexpected API response format", response.data);
            }
          } else {
            console.error("No meal plans found", mealPlanResponse.data);
          }
        } else {
          console.error("No companies found", companyResponse.data);
        }
      } catch (error) {
        console.error("Error fetching meal data:", error);
      } finally {
        setLoading(false); // 👈 Stop loading
      }
    };

    fetchMealData();
  }, []);

  const fetchMealsForPlan = async (companyId, planId) => {
    try {
      const response = await apiClient.get(
        `/client/company/${companyId}/meal-plans/${planId}`
      );
      if (Array.isArray(response.data?.meals)) {
        setMealData(response.data.meals);
      } else {
        console.error("Unexpected meal data", response.data);
      }
    } catch (error) {
      console.error("Failed to fetch meals for plan:", error);
    }
  };

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

  const availableDays = [
    ...new Set(mealData?.map((meal) => meal.day.toUpperCase()) || []),
  ];
  const totalCalories = filteredMeals
    .reduce((sum, meal) => sum + (meal.energyKcal || 0), 0)
    .toFixed(1); // Formats to one decimal place

  const missingDays = daysOfWeek.filter(
    (day) => !availableDays.includes(day.toUpperCase())
  );

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

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
            width: "60%",
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
                fontSize: RFPercentage(2.8), // Slightly bigger if preferred
              }}
            >
              {firstName} {surName}
            </Text>
          </Text>
        </View>
        <View
          style={{
            width: "40%",
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
            {companyName || "null"}
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
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setIsModalVisible(true)}
          style={{ width: "48%", marginTop: RFPercentage(1) }}
        >
          <Text style={styles.dateText}>Starting Date</Text>
          <View style={styles.dateContainers}>
            <Text
              style={{
                color: Colors.blacksuit,
                fontFamily: FontFamily.medium,
                fontSize: RFPercentage(1.4),
              }}
            >
              {startingDate && startingDate.includes("-")
                ? formatDate(startingDate)
                : "DD-MM-YYYY"}
            </Text>
            <TouchableOpacity activeOpacity={0.7} style={styles.calendarIcon}>
              <MaterialIcons
                name={"keyboard-arrow-down"}
                size={22}
                color={Colors.gray}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {(endingDate !== null ||
          (startingDate === null && endingDate === null)) && (
          <TouchableOpacity
            activeOpacity={0.7}
            style={{ width: "48%", marginTop: RFPercentage(1) }}
          >
            <Text style={styles.dateText}>Ending Date</Text>
            <View style={styles.dateContainers}>
              <Text
                style={{
                  color: Colors.blacksuit,
                  fontFamily: FontFamily.medium,
                  fontSize: RFPercentage(1.4),
                }}
              >
                {startingDate && startingDate.includes("-")
                  ? formatDate(endingDate)
                  : "DD-MM-YYYY"}
              </Text>
              <TouchableOpacity activeOpacity={0.7} style={styles.calendarIcon}>
                <MaterialIcons
                  name={"keyboard-arrow-down"}
                  size={22}
                  color={Colors.gray}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
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
                color: Colors.orange, // Use a different color
                fontFamily: FontFamily.regular,
                fontSize: RFPercentage(1.2), // Slightly bigger if preferred
              }}
            >
              {totalCalories} Kcal
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
      {loading ? (
        <AppLoading />
      ) : (
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
                    {meal.note ? (
                      <BarText barColor={Colors.purple} title={meal.note} />
                    ) : null}

                    {meal.energyKcal ? (
                      <View style={styles.CalContainer}>
                        <MaterialIcons
                          color={Colors.white}
                          size={18}
                          name={"electric-bolt"}
                        />
                        <Text style={styles.CalText}>
                          {meal.energyKcal.toFixed(1)}
                        </Text>
                      </View>
                    ) : null}
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
      )}
      {/* meal detaile end */}

      <DateSelectionModal
        visible={isModalVisible}
        setVisible={setIsModalVisible}
        label="Starting Date"
        plans={allMealPlans}
        onSelectDate={(selectedDate) => {
          const selectedPlan = allMealPlans.find(
            (p) => p.startingDate === selectedDate
          );
          if (selectedPlan) {
            setStartingDate(selectedPlan.startingDate);
            setEndingDate(selectedPlan.endingDate); // Automatically set ending date
            setFirstPlanId(selectedPlan.id);
            fetchMealsForPlan(companyId, selectedPlan.id);
          }
        }}
      />
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
    height: RFPercentage(15),
    justifyContent: "center", // Center the text vertically
    alignItems: "center", // Center the text horizontally
    borderRadius: RFPercentage(0.3),
    marginRight: RFPercentage(1.5),
  },
  rotationCon: {
    transform: [{ rotate: "-90deg" }], // Rotate the inner view
    width: RFPercentage(15), // Width of the rotated content
    height: RFPercentage(3), // Height of the rotated content
    justifyContent: "center",
    alignItems: "center",
  },
  rotText: {
    color: Colors.blacksuit,
    fontFamily: FontFamily.medium,
    fontSize: RFPercentage(1),
  },
  CalContainer: {
    width: RFPercentage(10),
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
  dateContainers: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: Colors.white,
    borderWidth: RFPercentage(0.1),
    borderColor: Colors.primary,
    color: Colors.blacktext,
    padding: RFPercentage(1.5),
    alignItems: "center",
    borderRadius: RFPercentage(1),
    justifyContent: "space-between",
    marginTop: RFPercentage(1),
  },
  dateText: {
    marginTop: RFPercentage(0.7),
    color: Colors.blacky,
    fontFamily: FontFamily.regular,
    fontSize: RFPercentage(1.2),
  },
});
