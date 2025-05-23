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
import { LinearGradient } from "expo-linear-gradient";
import {
  Ionicons,
  Fontisto,
  MaterialCommunityIcons,
  AntDesign,
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import moment from "moment";
//Components
import Screen from "../../components/Screen";
import AppButton from "../../components/AppButton";

// apis
import apiClient from "../../apis/apiClient";

//config
import icons from "../../config/icons";
import Colors from "../../config/Colors";
import { FontFamily } from "../../config/font";
import DietitianEvent from "../../components/Specific/DietitianEvent";

const CalendarEvent = ({ navigation }) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const daysInMay2025 = Array.from({ length: 31 }, (_, i) => {
    const date = moment(`2025-05-${i + 1}`, "YYYY-MM-DD");
    return {
      day: date.format("D"), // "1", "2", ...
      weekday: date.format("ddd"), // "Thu", "Fri", ...
    };
  });

  const eventData = [
    {
      id: "1",
      month: "May",
      day: "04",
      eventTitle: "Diet Progress Check-in",
      time: "09:00AM - 02:30PM",
    },
    {
      id: "2",
      month: "May",
      day: "04",
      eventTitle: "Q&A with Dietitian",
      time: "10:00AM - 01:00PM",
    },
    {
      id: "3",
      month: "May",
      day: "04",
      eventTitle: "Follow-up Consultation",
      time: "11:30AM - 03:00PM",
    },
    // Add more objects as needed...
  ];
  const eventDataTomorrow = [
    {
      id: "1",
      month: "May",
      day: "05",
      eventTitle: "Health Report Review",
      time: "09:00AM - 02:30PM",
    },
  ];
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
            onPress={() => navigation.navigate("CalendarScreen")}
          >
            <MaterialCommunityIcons
              color={Colors.blacksuit}
              style={{ marginLeft: RFPercentage(0.5) }}
              size={24}
              name={"calendar-month"}
            />
          </TouchableOpacity>
        </View>

        <Feather color={Colors.blacky} size={24} name={"search"} />
      </View>

      {/* scroll date */}

      <View
        style={{
          width: "100%",
          marginTop: RFPercentage(3),
        }}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {daysInMay2025.map((item, index) => {
            const isSelected = selectedDayIndex === index;

            const content = (
              <View
                style={{
                  width: RFPercentage(6),
                  paddingHorizontal: RFPercentage(0.5),
                  paddingVertical: RFPercentage(1),
                  borderRadius: RFPercentage(1.5),
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: isSelected ? Colors.white : Colors.stroke,
                    fontFamily: FontFamily.regular,
                    fontSize: RFPercentage(1.9),
                  }}
                >
                  {item.weekday}
                </Text>
                <Text
                  style={{
                    marginTop: RFPercentage(1),
                    color: Colors.blacky,
                    fontFamily: FontFamily.medium,
                    fontSize: RFPercentage(2.2),
                  }}
                >
                  {item.day}
                </Text>
              </View>
            );

            return (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedDayIndex(index)}
                style={{
                  marginLeft: RFPercentage(1.5),
                  borderRadius: RFPercentage(1),
                  overflow: "hidden",
                }}
              >
                {isSelected ? (
                  <LinearGradient
                    colors={[Colors.lightgreen, Colors.primary]} // Define your two gradient colors here
                    start={{ x: 0, y: 0 }} // Start point (top-left)
                    end={{ x: 1, y: 1 }} // End point (bottom-right)
                    style={{
                      borderRadius: RFPercentage(1.2),
                    }}
                  >
                    {content}
                  </LinearGradient>
                ) : (
                  <View
                    style={{
                      backgroundColor: Colors.white,
                      borderRadius: RFPercentage(1),
                    }}
                  >
                    {content}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View
        style={{
          width: "85%",
          height: RFPercentage(0.1),
          backgroundColor: Colors.lightWhite,
          marginTop: RFPercentage(2),
        }}
      />

      {/* events */}

      <View style={styles.dotContainer}>
        <View style={styles.dot} />
        <Text style={styles.scheduleText}>Today Schedule (3)</Text>
      </View>

      <ScrollView
        style={{ width: "100%", flexGrow: 0 }}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        {eventData.map((event) => (
          <DietitianEvent
            key={event.id}
            month={event.month}
            day={event.day}
            eventTitle={event.eventTitle}
            time={event.time}
            onPress={() => navigation.navigate("ManageEvent")}
          />
        ))}
      </ScrollView>

      {/* tommorow Event */}

      <View style={styles.dotContainer}>
        <View style={styles.dot} />
        <Text style={styles.scheduleText}>Tomorrow Schedule (1)</Text>
      </View>

      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        {eventDataTomorrow.map((event) => (
          <DietitianEvent
            key={event.id}
            month={event.month}
            day={event.day}
            eventTitle={event.eventTitle}
            time={event.time}
            onPress={() => navigation.navigate("ManageEvent")}
          />
        ))}
      </ScrollView>

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

export default CalendarEvent;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  scheduleText: {
    color: Colors.blacky,
    fontFamily: FontFamily.medium,
    fontSize: RFPercentage(2),
  },
  dot: {
    width: RFPercentage(1.5),
    height: RFPercentage(1.5),
    borderRadius: RFPercentage(2),
    backgroundColor: "#A198B8",
    marginRight: RFPercentage(1),
  },
  dotContainer: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: RFPercentage(2),
    marginBottom: RFPercentage(1),
  },
  loginbutton: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: RFPercentage(1.5),
  },
});
