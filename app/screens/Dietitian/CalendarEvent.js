import React, { useState, useEffect, useRef } from "react";
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
import AppLoading from "../../components/AppLoading";

// apis
import apiClient from "../../apis/apiClient";

//config
import icons from "../../config/icons";
import Colors from "../../config/Colors";
import { FontFamily } from "../../config/font";

const CalendarEvent = ({ navigation, route }) => {
  const selectedDate = route.params?.selectedDate;
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [selectedDayDate, setSelectedDayDate] = useState(null);
  const [eventsForSelectedDay, setEventsForSelectedDay] = useState([]);
  const [allEventsByDate, setAllEventsByDate] = useState([]); // [{ date: "YYYY-MM-DD", events: [...] }]
  const [loadedDays, setLoadedDays] = useState(0); // how many 5-day chunks we've loaded
  const [isLoading, setIsLoading] = useState(false); // For UI display
  const [initialLoadDone, setInitialLoadDone] = useState(false); // To track first fetch
  const [weekDays, setWeekDays] = useState([]);
  const scrollRef = useRef(null);
  const sectionRefs = useRef({});

  // Handles initial load and when selectedDate from route.params changes
  useEffect(() => {
    const currentDate =
      route.params?.selectedDate || moment().format("YYYY-MM-DD");

    const startOfWeek = moment(currentDate).startOf("week");
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
    setSelectedDayDate(moment(currentDate).format("YYYY-MM-DD"));

    // Also fetch fresh events whenever selected date changes from route
    fetchNextNDaysEvents(currentDate, 5, currentDate, true);
  }, [route.params?.selectedDate]);

  useEffect(() => {
    const initialDate = selectedDate || moment().format("YYYY-MM-DD");
    setSelectedDayDate(initialDate);
    fetchNextNDaysEvents(initialDate, 5, initialDate, true); // ← reset
  }, []);

  const fetchNextNDaysEvents = async (
    startDate,
    daysToFetch = 5,
    scrollToDate = null,
    shouldReset = false
  ) => {
    if (!initialLoadDone) setIsLoading(true); // ✅ Only on initial fetch
    try {
      const eventPromises = [];

      for (let i = 0; i < daysToFetch; i++) {
        const date = moment(startDate).add(i, "days").format("YYYY-MM-DD");
        eventPromises.push(apiClient.get(`/calendar?date=${date}`));
      }

      const results = await Promise.all(eventPromises);

      const fetchedData = results
        .map((res, index) => {
          const date = moment(startDate)
            .add(index, "days")
            .format("YYYY-MM-DD");
          if (res.status === 200 && res.data.length > 0) {
            return { date, events: res.data };
          } else {
            return null;
          }
        })
        .filter(Boolean);

      setAllEventsByDate((prev) => {
        const existingDates = shouldReset
          ? new Set()
          : new Set(prev.map((item) => item.date));
        const combined = shouldReset ? [] : [...prev];

        const newUniqueData = fetchedData.filter(
          (item) => !existingDates.has(item.date)
        );

        const merged = [...combined, ...newUniqueData];

        // Sort by date ascending
        merged.sort((a, b) => moment(a.date).diff(moment(b.date)));

        return merged;
      });

      if (shouldReset) {
        setLoadedDays(daysToFetch);
      } else {
        setLoadedDays((prev) => prev + daysToFetch);
      }

      // Scroll to selected section
      setTimeout(() => {
        if (scrollRef.current && sectionRefs.current[scrollToDate]) {
          sectionRefs.current[scrollToDate].measureLayout(
            scrollRef.current,
            (x, y) => {
              scrollRef.current.scrollTo({ y, animated: true });
            },
            (error) => {
              console.warn("Measure layout failed", error);
            }
          );
        }
      }, 300);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      if (!initialLoadDone) {
        setIsLoading(false); // ✅ Only stop loading after initial fetch
        setInitialLoadDone(true); // ✅ Mark initial fetch complete
      }
    }
  };
  useEffect(() => {
    if (route.params?.refresh) {
      fetchNextNDaysEvents(selectedDayDate, 5, selectedDayDate, true);
      navigation.setParams({ refresh: false });
    }
  }, [route.params?.refresh]);

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
          // onPress={() => navigation.goBack()}
        >
          <AntDesign color={Colors.white} size={24} name={"arrowleft"} />
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
          width: "90%",
          marginTop: RFPercentage(3),
          flexDirection: "row",
          alignItems: "center",
          // backgroundColor: Colors.brown,
        }}
      >
        {weekDays.map((item, index) => {
          const isSelected = selectedDayIndex === index;

          const content = (
            <View
              style={{
                width: RFPercentage(5),
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
                  fontSize: RFPercentage(1.7),
                }}
              >
                {item.weekday}
              </Text>
              <Text
                style={{
                  marginTop: RFPercentage(1),
                  color: Colors.blacky,
                  fontFamily: FontFamily.medium,
                  fontSize: RFPercentage(2),
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
                const selected = item.date.format("YYYY-MM-DD");
                setSelectedDayDate(selected);

                // Reset and refetch starting from new selected date
                fetchNextNDaysEvents(selected, 5, selected, true);
              }}
              style={{
                marginRight: RFPercentage(1.1),
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
      {isLoading ? (
        <AppLoading />
      ) : (
        <ScrollView
          style={{ width: "100%", flexGrow: 1 }}
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: RFPercentage(8),
          }}
          showsVerticalScrollIndicator={false}
          onScroll={({ nativeEvent }) => {
            const bottomReached =
              nativeEvent.layoutMeasurement.height +
                nativeEvent.contentOffset.y >=
              nativeEvent.contentSize.height - 20;
            if (bottomReached) {
              const nextDate = moment(selectedDayDate)
                .add(loadedDays, "days")
                .format("YYYY-MM-DD");
              fetchNextNDaysEvents(nextDate, 5);
            }
          }}
          scrollEventThrottle={400}
        >
          {allEventsByDate.map(({ date, events }) => (
            <View
              key={date}
              ref={(ref) => {
                if (ref) {
                  sectionRefs.current[date] = ref;
                }
              }}
            >
              <View style={styles.dotContainer}>
                <View style={styles.dot} />
                <Text style={styles.scheduleText}>
                  {moment(date).isSame(moment(), "day")
                    ? `Today Schedule (${events.length})`
                    : `${moment(date).format("dddd")} Schedule (${
                        events.length
                      })`}
                </Text>
              </View>

              {events.map((event) => (
                <DietitianEvent
                  key={event.id}
                  day={moment(event.startDate).format("YYYY-MM-DD")} // Pass full date string
                  eventTitle={event.title}
                  time={
                    event.startTime && event.endTime
                      ? `${event.startTime} - ${event.endTime}`
                      : "All Day"
                  }
                  onPress={() =>
                    navigation.navigate("CreateEventScreen", {
                      eventId: event.id,
                    })
                  }
                />
              ))}
            </View>
          ))}
        </ScrollView>
      )}
      {/* tommorow Event */}

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
