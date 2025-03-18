import React, { useState, useEffect } from "react";
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

//Components
import Screen from "../components/Screen";
import AppButton from "../components/AppButton";
import DatePicker from "../components/DatePicker";

//config
import icons from "../config/icons";
import Colors from "../config/Colors";
import { FontFamily } from "../config/font";

const HomeScreen = () => {
  const [date, setDate] = useState("");
  const [error, setError] = useState({ date: false });

  const handleDateChange = (formattedDate) => {
    setDate(formattedDate);
    console.log("Selected Date:", formattedDate);
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

      {/* <View
        style={{
          backgroundColor: Colors.primary, // Set background color
          padding: RFPercentage(0.2), // Add padding
          justifyContent: "center", // Center the text vertically
          alignItems: "center", // Center the text horizontally
          transform: [{ rotate: "-90deg" }], // Rotate the text by -90 degrees
        }}
      >
        <Text
          style={{
            color: Colors.blacksuit,
            fontFamily: FontFamily.medium,
            fontSize: RFPercentage(1.2),
          }}
        >
          Company Name
        </Text>
      </View> */}
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
});
