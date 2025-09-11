import React, { useState, useEffect, useRef } from "react";
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
  TextInput,
  PanResponder,
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

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

const CalendarEvent = ({ route }) => {
  const navigation = useNavigation();
  const selectedDate = route.params?.selectedDate;
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [selectedDayDate, setSelectedDayDate] = useState(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allEventsByDate, setAllEventsByDate] = useState([]); // [{ date: "YYYY-MM-DD", events: [...] }]
  const [loadedDays, setLoadedDays] = useState(0); // how many 5-day chunks we've loaded
  const [isLoading, setIsLoading] = useState(false); // For UI display
  const [initialLoadDone, setInitialLoadDone] = useState(false); // To track first fetch
  const [weekDays, setWeekDays] = useState([]);
  const scrollRef = useRef(null);
  const sectionRefs = useRef({});
  const weekdayScrollRef = useRef(null);
  const weekdayItemRefs = useRef({});
  const lastFetchedDateRef = useRef(null); // ✅ Use for tracking the last fetched day

  const [currentWeekStart, setCurrentWeekStart] = useState(
    moment().startOf("week")
  );

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderRelease: (evt, gestureState) => {
      const dx = gestureState.dx;

      if (dx < -20) {
        // Swiped left: go to next week
        const nextWeek = moment(currentWeekStart).add(7, "days");
        setCurrentWeekStart(nextWeek);
        updateWeek(nextWeek);
      } else if (dx > 20) {
        // Swiped right: go to previous or current week
        const prevWeek = moment(currentWeekStart).subtract(7, "days");
        const presentWeek = moment().startOf("week");

        if (currentWeekStart.isAfter(presentWeek)) {
          setCurrentWeekStart(presentWeek);
          updateWeek(presentWeek);
        } else {
          setCurrentWeekStart(prevWeek);
          updateWeek(prevWeek);
        }
      }
    },
  });

  const updateWeek = (newStartOfWeek) => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = moment(newStartOfWeek).add(i, "days");
      return {
        date,
        day: date.format("D"),
        weekday: date.format("ddd"),
      };
    });

    const defaultSelectedIndex = 0; // Or 3 for center
    const selectedDate = days[defaultSelectedIndex].date.format("YYYY-MM-DD");

    setCurrentWeekStart(newStartOfWeek);
    setWeekDays(days);
    setSelectedDayIndex(defaultSelectedIndex);
    setSelectedDayDate(selectedDate);
    fetchNextNDaysEvents(selectedDate, 2, selectedDate, true);
  };

  const handleWeekUpdate = (newDateStr) => {
    const newDate = moment(newDateStr);
    const newStartOfWeek = moment(newDate).startOf("week");

    if (!newStartOfWeek.isSame(currentWeekStart, "week")) {
      const days = Array.from({ length: 7 }, (_, i) => {
        const date = moment(newStartOfWeek).add(i, "days");
        return {
          date,
          day: date.format("D"),
          weekday: date.format("ddd"),
        };
      });

      setCurrentWeekStart(newStartOfWeek);
      setWeekDays(days);

      const newIndex = days.findIndex((d) =>
        d.date.isSame(moment(newDateStr), "day")
      );
      setSelectedDayIndex(newIndex);
    } else {
      const index = weekDays.findIndex((d) =>
        d.date.isSame(moment(newDateStr), "day")
      );
      if (index !== -1) setSelectedDayIndex(index);
    }

    setSelectedDayDate(newDateStr);
  };

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
    const formattedDate = moment(currentDate).format("YYYY-MM-DD");
    setSelectedDayDate(formattedDate);
    lastFetchedDateRef.current = moment(formattedDate)
      .subtract(1, "day")
      .format("YYYY-MM-DD"); // So first fetch starts at currentDate
    fetchNextNDaysEvents(formattedDate, 2, formattedDate, true);
  }, [route.params?.selectedDate]);

  useEffect(() => {
    const initialDate = selectedDate || moment().format("YYYY-MM-DD");
    setSelectedDayDate(initialDate);
    fetchNextNDaysEvents(initialDate, 2, initialDate, true); // ← reset
  }, []);

  const fetchNextNDaysEvents = async (
    startDate,
    daysToFetch = 2,
    scrollToDate = null,
    shouldReset = false,
    allowEmptyReturn = false
  ) => {
    if (!initialLoadDone) setIsLoading(true); // ✅ Show loading only on first fetch

    try {
      console.log(
        `🔄 Fetching ${daysToFetch} day(s) starting from:`,
        startDate
      );
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
            console.log(`✅ Events found for ${date}:`, res.data);
            return { date, events: res.data };
          } else {
            return null;
          }
        })
        .filter(Boolean);

      // ✅ If no events and not allowed, stop here
      if (fetchedData.length === 0 && !allowEmptyReturn) {
        console.log(
          "⚠️ No events found and empty return not allowed. Skipping."
        );
        return [];
      }

      // ✅ Update state with new event data
      setAllEventsByDate((prev) => {
        const existingDates = shouldReset
          ? new Set()
          : new Set(prev.map((item) => item.date));
        const combined = shouldReset ? [] : [...prev];

        const newUniqueData = fetchedData.filter(
          (item) => !existingDates.has(item.date)
        );

        const merged = [...combined, ...newUniqueData];
        merged.sort((a, b) => moment(a.date).diff(moment(b.date)));
        console.log("🧩 Merged events:", merged);
        return merged;
      });

      // ✅ Update UI only if we received data
      if (fetchedData.length > 0) {
        if (shouldReset) {
          setSelectedDayDate(startDate);
        } else {
          setLoadedDays((prev) => prev + daysToFetch);
        }

        handleWeekUpdate(startDate);
      }

      // ✅ Scroll to the newly loaded section
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
      const lastFetched = moment(startDate).add(daysToFetch - 1, "days");
      lastFetchedDateRef.current = lastFetched.format("YYYY-MM-DD");
      return fetchedData; // ✅ Return for caller to inspect
    } catch (err) {
      console.error("Failed to fetch events:", err);
      return [];
    } finally {
      if (!initialLoadDone) {
        setIsLoading(false); // ✅ End loading spinner
        setInitialLoadDone(true); // ✅ First load done
      }
    }
  };
  useEffect(() => {
    console.log("📅 Events to render (filtered):", filteredEventsByDate);
  }, [filteredEventsByDate]);

  useEffect(() => {
    if (route.params?.refresh) {
      fetchNextNDaysEvents(selectedDayDate, 2, selectedDayDate, true);
      navigation.setParams({ refresh: false });
    }
  }, [route.params?.refresh]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken"); // ✅ Clear token
      navigation.reset({
        index: 0,
        routes: [{ name: "LoginScreen" }], // 👈 Update to your login screen name
      });
    } catch (error) {
      Alert.alert(
        "Logout Failed",
        "Something went wrong while logging out. Please try again."
      );
    }
  };

  const filteredEventsByDate = searchQuery
    ? allEventsByDate
        .map(({ date, events }) => {
          const filteredEvents = events.filter((event) =>
            event.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
          return { date, events: filteredEvents };
        })
        .filter(({ events }) => events.length > 0) // remove empty sections
    : allEventsByDate;

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
        {isSearchVisible ? (
          // 🔍 Search Field
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: RFPercentage(0.1),
              borderColor: Colors.lightWhite,
              borderRadius: RFPercentage(3),
              paddingHorizontal: RFPercentage(1),
              flex: 1,
              padding: RFPercentage(1),
              paddingHorizontal: RFPercentage(2),
            }}
          >
            <TextInput
              placeholder="Search..."
              placeholderTextColor={Colors.grey}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{
                flex: 1,
                color: Colors.blacky,
                fontFamily: FontFamily.regular,
                fontSize: RFPercentage(1.6),
              }}
            />
            <TouchableOpacity
              onPress={() => {
                setIsSearchVisible(false);
                setSearchQuery(""); // optional: reset search
              }}
            >
              <Text
                style={{ fontSize: RFPercentage(2.5), color: Colors.blacky }}
              >
                ×
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          // 📆 Calendar & Icons Section
          <>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsSearchVisible(true)}
            >
              <Feather color={Colors.blacky} size={24} name={"search"} />
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
            <TouchableOpacity activeOpacity={0.7} onPress={handleLogout}>
              <MaterialIcons color={Colors.red} size={24} name={"logout"} />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* scroll date */}

      <ScrollView
        ref={weekdayScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
          paddingRight: RFPercentage(3),
          paddingLeft: RFPercentage(2.5),
        }}
        style={{
          width: "100%",
          flexGrow: 0,
          flexShrink: 0,
          marginTop: isSearchVisible ? RFPercentage(1.1) : RFPercentage(3),
        }}
        {...panResponder.panHandlers}
      >
        {weekDays.map((item, index) => {
          const isSelected = selectedDayIndex === index;

          const content = (
            <View
              style={{
                paddingHorizontal: RFPercentage(0.8),
                paddingVertical: RFPercentage(1),
                borderRadius: RFPercentage(1.8),
                alignItems: "center",
                justifyContent: "center",
                minWidth: RFPercentage(5.6),
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
                fetchNextNDaysEvents(selected, 2, selected, true);
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
      </ScrollView>

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
          style={{ width: "100%", flex: 1 }}
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: RFPercentage(8),
          }}
          showsVerticalScrollIndicator={false}
          onScroll={async ({ nativeEvent }) => {
            const bottomReached =
              nativeEvent.layoutMeasurement.height +
                nativeEvent.contentOffset.y >=
              nativeEvent.contentSize.height - 20;

            if (bottomReached) {
              let found = false;
              let maxTries = 7;

              let tryDate = moment(
                lastFetchedDateRef.current || selectedDayDate
              )
                .add(1, "day")
                .format("YYYY-MM-DD");

              while (!found && maxTries > 0) {
                const result = await fetchNextNDaysEvents(
                  tryDate,
                  1,
                  tryDate,
                  false,
                  true
                );

                if (result?.length > 0) {
                  setSelectedDayDate(tryDate);
                  handleWeekUpdate(tryDate);
                  found = true;
                } else {
                  tryDate = moment(tryDate).add(1, "day").format("YYYY-MM-DD");
                  maxTries--;
                }
              }
            }
          }}
          // scrollEventThrottle={400}
        >
          {filteredEventsByDate.length > 0 ? (
            filteredEventsByDate.map(({ date, events }) => (
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
            ))
          ) : (
            <Text
              style={{
                marginTop: RFPercentage(5),
                fontSize: RFPercentage(2),
                color: Colors.red,
                fontFamily: FontFamily.medium,
              }}
            >
              {searchQuery
                ? `No events found : "${searchQuery}"`
                : "No events found"}
            </Text>
          )}
        </ScrollView>
      )}

      <TouchableOpacity
        onPress={() =>
          navigation.navigate("CreateEventScreen", {
            selectedIndex: selectedDayDate, // 👈 pass here
          })
        }
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
