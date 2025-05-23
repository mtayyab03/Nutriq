import React, { useState, useEffect } from "react";
import { Image, TouchableOpacity, StyleSheet, View, Text } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import {
  Ionicons,
  Fontisto,
  MaterialCommunityIcons,
  AntDesign,
  Feather,
} from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";

//Components
import Screen from "../../components/Screen";
import AppButton from "../../components/AppButton";

// apis
import apiClient from "../../apis/apiClient";

//config
import icons from "../../config/icons";
import Colors from "../../config/Colors";
import { FontFamily } from "../../config/font";

const CalendarScreen = ({ navigation }) => {
  const events = {
    "2025-05-22": [{ title: "Meeting with John", time: "10:00 AM" }],
    "2025-05-23": [{ title: "Doctor Appointment", time: "2:00 PM" }],
    "2025-05-25": [
      { title: "Birthday Party", time: "6:00 PM" },
      { title: "Dinner with Family", time: "8:00 PM" },
    ],
  };
  const [selectedDate, setSelectedDate] = useState("");

  const renderEvents = () => {
    if (!selectedDate || !events[selectedDate]) {
      return <Text style={styles.noEvent}>No Events</Text>;
    }

    return events[selectedDate].map((event, index) => (
      <View key={index} style={styles.eventCard}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventTime}>{event.time}</Text>
      </View>
    ));
  };
  return (
    <Screen style={styles.screen}>
      <View
        style={{
          width: "90%",
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          marginTop: RFPercentage(1.5),
        }}
      >
        <TouchableOpacity
          style={styles.leftIcon}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <AntDesign color={Colors.blacky} size={24} name={"arrowleft"} />
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              color: Colors.blacky,
              fontFamily: FontFamily.medium,
              fontSize: RFPercentage(2.3),
            }}
          >
            Calendar
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate("CalendarEvent")}
          >
            <MaterialCommunityIcons
              color={Colors.blacksuit}
              style={{ marginLeft: RFPercentage(0.5) }}
              size={24}
              name={"calendar"}
            />
          </TouchableOpacity>
        </View>

        <Feather color={Colors.blacky} size={24} name={"search"} />
      </View>

      <View style={styles.shadowWrapper}>
        <View style={styles.container}>
          <Calendar
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
            }}
            markedDates={{
              ...Object.keys(events).reduce((acc, date) => {
                acc[date] = { marked: true, dotColor: "blue" };
                return acc;
              }, {}),
              ...(selectedDate
                ? {
                    [selectedDate]: {
                      selected: true,
                      selectedColor: Colors.primary,
                    },
                  }
                : {}),
            }}
            theme={{
              selectedDayBackgroundColor: "green",
              todayTextColor: "red",
              arrowColor: "#B5BEC6", // ✅ arrow color
              textMonthFontSize: 20,
              textMonthFontFamily: FontFamily.semiBold, // <-- font family here
              textDayHeaderFontFamily: FontFamily.semiBold,
              // Make day numbers bold
              textDayFontFamily: FontFamily.semiBold,
            }}
          />
        </View>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("CreateEventScreen")}
        style={[
          styles.loginbutton,
          { position: "absolute", bottom: RFPercentage(6) },
        ]}
        activeOpacity={0.7}
      >
        <AppButton title={"Create Event"} buttonColor={Colors.primary} />
      </TouchableOpacity>
    </Screen>
  );
};

export default CalendarScreen;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.white,
  },

  shadowWrapper: {
    marginTop: RFPercentage(4),
    width: "90%",
    borderRadius: RFPercentage(1.5),
    paddng: RFPercentage(2),
    backgroundColor: Colors.purewhite,
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,

    // Android shadow
    elevation: 5,
  },
  container: {
    borderRadius: RFPercentage(1.5),
    overflow: "hidden", // clips corners of Calendar
    padding: RFPercentage(2),
  },
  eventList: {
    marginTop: 20,
  },
  eventCard: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  eventTime: {
    fontSize: 14,
    color: "gray",
  },
  noEvent: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
  loginbutton: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: RFPercentage(1.5),
  },
});
