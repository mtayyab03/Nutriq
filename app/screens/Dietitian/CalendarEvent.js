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
  MaterialCommunityIcons,
  AntDesign,
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";
import moment from "moment";
//Components
import Screen from "../../components/Screen";
import AppButton from "../../components/AppButton";
import DietitianEvent from "../../components/Specific/DietitianEvent";

// apis
import apiClient from "../../apis/apiClient";

//config
import icons from "../../config/icons";
import Colors from "../../config/Colors";
import { FontFamily } from "../../config/font";

const CalendarEvent = ({ navigation, route }) => {
  const selectedDate = route.params?.selectedDate;
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [eventsToday, setEventsToday] = useState([]);
  const [eventsTomorrow, setEventsTomorrow] = useState([]);
  const [selectedDayDate, setSelectedDayDate] = useState(null);
  const [eventsForSelectedDay, setEventsForSelectedDay] = useState([]);

  const [weekDays, setWeekDays] = useState([]);

  useEffect(() => {
    const currentDate = selectedDate || moment().format("YYYY-MM-DD");

    const startOfWeek = moment(currentDate).startOf("week"); // Sunday
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = moment(startOfWeek).add(i, "days");
      return {
        date,
        day: date.format("D"),
        weekday: date.format("ddd"),
      };
    });

    const index = days.findIndex((d) =>
      d.date.isSame(moment(currentDate), "day")
    );

    setWeekDays(days);
    setSelectedDayIndex(index);
    setSelectedDayDate(moment(currentDate).format("YYYY-MM-DD")); // ensure string
  }, [selectedDate]);

  useEffect(() => {
    if (!selectedDayDate) return;

    const fetchEvents = async () => {
      const tomorrow = moment(selectedDayDate)
        .add(1, "day")
        .format("YYYY-MM-DD");

      try {
        const [resToday, resTomorrow] = await Promise.all([
          apiClient.get(`/calendar?date=${selectedDayDate}`),
          apiClient.get(`/calendar?date=${tomorrow}`),
        ]);

        if (resToday.status === 200) {
          setEventsForSelectedDay(resToday.data || []);
        } else {
          console.log("Error fetching selected day events:", resToday.problem);
        }

        if (resTomorrow.status === 200) {
          setEventsTomorrow(resTomorrow.data || []);
        } else {
          console.log("Error fetching tomorrow's events:", resTomorrow.problem);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
    if (route.params?.refresh) {
      navigation.setParams({ refresh: false }); // reset to prevent loop
    }
  }, [selectedDayDate, route.params?.refresh]);

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
          {weekDays.map((item, index) => {
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
                onPress={() => {
                  setSelectedDayIndex(index);
                  setSelectedDayDate(item.date.format("YYYY-MM-DD"));
                }}
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
        <Text style={styles.scheduleText}>
          Today Schedule ({eventsForSelectedDay.length})
        </Text>
      </View>

      {eventsForSelectedDay.length === 0 ? (
        <Text style={styles.noEventText}>No events for today</Text>
      ) : (
        <ScrollView
          style={{ width: "100%", flexGrow: 0, maxHeight: RFPercentage(36) }}
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
          }}
          showsVerticalScrollIndicator={false}
        >
          {eventsForSelectedDay.map((event) => (
            <DietitianEvent
              key={event.id}
              day={moment(event.startDate).format("YYYY-MM-DD")} // Pass full date string
              eventTitle={event.title}
              time={`${event.startTime} - ${event.endTime}`}
              onPress={() =>
                navigation.navigate("CreateEventScreen", {
                  eventId: event.id,
                })
              }
            />
          ))}
        </ScrollView>
      )}
      {/* tommorow Event */}

      <View style={styles.dotContainer}>
        <View style={styles.dot} />
        <Text style={styles.scheduleText}>
          Tomorrow Schedule ({eventsTomorrow.length})
        </Text>
      </View>

      {eventsTomorrow.length === 0 ? (
        <Text style={styles.noEventText}>No events for tomorrow</Text>
      ) : (
        <ScrollView
          style={{ width: "100%", maxHeight: RFPercentage(36) }}
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
          }}
          showsVerticalScrollIndicator={false}
        >
          {eventsTomorrow.map((event) => (
            <DietitianEvent
              key={event.id}
              day={moment(event.startDate).format("YYYY-MM-DD")} // Pass full date string
              eventTitle={event.title}
              time={`${event.startTime} - ${event.endTime}`}
              onPress={() =>
                navigation.navigate("CreateEventScreen", {
                  eventId: event.id,
                })
              }
            />
          ))}
        </ScrollView>
      )}
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
  noEventText: {
    fontSize: RFPercentage(2),
    fontFamily: FontFamily.medium,
    color: Colors.red,
    textAlign: "center",
    marginVertical: RFPercentage(2),
  },
});
