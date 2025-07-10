import React, { useState, useEffect, useRef } from "react";
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Fontisto } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment"; // If not already imported

//Components
import Screen from "../../components/Screen";
import AppButton from "../../components/AppButton";
import CommonHeader from "../../components/common/CommonHeader";
import InputField from "../../components/InputField";
import DatePicker from "../../components/DatePicker";
import AppLine from "../../components/AppLine";
import RadioButton from "../../components/common/RadioButton";
import CommonModal from "../../components/Specific/CommonModal";
import CustomAlert from "../../components/common/CustomAlert";

// apis
import apiClient from "../../apis/apiClient";

//config
import icons from "../../config/icons";
import Colors from "../../config/Colors";
import { FontFamily } from "../../config/font";

const CreateEventScreen = ({ navigation, route }) => {
  const scrollRef = useRef(null);
  const { eventId, selectedIndex } = route.params || {};
  console.log("selected day", selectedIndex);
  const [title, setTitle] = useState(""); // Add loading state
  const [date, setDate] = useState("DD-MM-YYYY");
  const [error, setError] = useState({ date: false });
  const [menuid, setmenuid] = useState(1);
  const [isDelModalVisible, setIsDelModalVisible] = useState(false);
  const [startingTime, setStartingTime] = useState("HH:MM");
  const [endingTime, setEndingTime] = useState("HH:MM");
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]); // [{ id, email }]
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  useEffect(() => {
    if (!eventId && selectedIndex) {
      const formattedDate = moment(selectedIndex).format("DD-MM-YYYY");
      setDate(formattedDate);
    }
  }, [eventId, selectedIndex]);

  const toggleSwitch = () => {
    setIsSwitchOn((prev) => !prev);
    if (!isSwitchOn) {
      setIsModalVisible(true); // Show modal only when switching ON
    }
  };

  const convertTo24Hour = (time) => {
    // Normalize any non-breaking spaces
    const cleanedTime = time.replace(/\s+/g, " ").trim(); // replaces multiple/unicode spaces with a regular space
    const [timePart, modifier] = cleanedTime.split(" ");
    if (!timePart || !modifier) return "00:00"; // fallback

    const [hStr, mStr] = timePart.split(":");
    let hours = parseInt(hStr, 10);
    let minutes = parseInt(mStr, 10);

    if (modifier.toLowerCase() === "pm" && hours < 12) hours += 12;
    if (modifier.toLowerCase() === "am" && hours === 12) hours = 0;

    const hh = hours.toString().padStart(2, "0");
    const mm = minutes.toString().padStart(2, "0");

    return `${hh}:${mm}`;
  };

  const handleDateChange = (formattedDate) => {
    setDate(formattedDate);
    console.log("Selected Date:", formattedDate);
  };
  const handleTimeChange = (value, type) => {
    const formattedTime = convertTo24Hour(value);
    console.log("Selected time:", type, value);
    if (type === "startTime") {
      setStartingTime(formattedTime);
    } else {
      setEndingTime(formattedTime);
    }
  };
  const selectTime = [
    {
      id: 1,
      name: "Select Time",
    },
    {
      id: 2,
      name: "All Day",
    },
  ];

  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState([]);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleInputChange = (text) => {
    if (text.endsWith(",") || text.endsWith(" ")) {
      const email = text.slice(0, -1).trim();
      if (email && validateEmail(email)) {
        setEmails((prev) => [...prev, email]);
      }
      setEmailInput("");
    } else {
      setEmailInput(text);
    }
  };

  const handleRemoveEmail = (index) => {
    setSelectedContacts((prev) => prev.filter((_, i) => i !== index));
    setEmails(emails.filter((_, i) => i !== index));
  };

  const reverseDateFormat = (dateStr) => {
    // Expects "DD-MM-YYYY", returns "YYYY-MM-DD"
    const [dd, mm, yyyy] = dateStr.split("-");
    return `${yyyy}-${mm}-${dd}`;
  };

  useFocusEffect(
    React.useCallback(() => {
      const contacts = route?.params?.selectedContacts || [];

      if (contacts.length > 0) {
        setSelectedContacts(contacts);

        // Extract names or emails from selected contacts
        const selectedFromContacts = contacts.map((c) => c.name || c.email);

        // Merge with previously entered emails (avoid duplicates)
        setEmails((prevEmails) => {
          const merged = [...prevEmails];
          selectedFromContacts.forEach((email) => {
            if (!merged.includes(email)) merged.push(email);
          });
          return merged;
        });
      }
    }, [route?.params?.selectedContacts])
  );

  const handleSubmit = async () => {
    if (!date || date === "YYYY-MM-DD") {
      setAlertMessage("Please select a valid date.");
      setAlertType("error");
      setAlertVisible(true);
      return;
    }

    try {
      const allDay = menuid === 2;

      const userParticipants = selectedContacts
        .filter((c) => c.status === "colleague")
        .map((c) => c.id);

      const clientParticipants = selectedContacts
        .filter((c) => c.status === "customer")
        .map((c) => c.id);

      const registeredEmails = selectedContacts.map((c) => c.email);
      const filteredUnregisteredEmails = emails.filter(
        (email) => !registeredEmails.includes(email)
      );

      const payload = {
        title,
        startDate: reverseDateFormat(date),
        allDay,
        notifyParticipants: isSwitchOn,
        unregisteredEmails: filteredUnregisteredEmails,
        userParticipants,
        clientParticipants,
      };

      if (!allDay) {
        payload.startTime = startingTime;
        payload.endTime = endingTime;
      }

      console.log("Sending payload:", payload);

      const response = eventId
        ? await apiClient.put(`/calendar/${eventId}`, payload)
        : await apiClient.post("/calendar", payload);

      if (response.status === 200 || response.status === 201) {
        setAlertMessage(
          `Event ${eventId ? "updated" : "created"} successfully!`
        );
        setAlertType("success"); // Success type
        setAlertVisible(true);
        setTimeout(() => {
          navigation.navigate("CalendarEvent", { refresh: true });
        }, 4000); // 5000 ms = 5 seconds
      } else {
        setAlertMessage("Operation failed.");
        setAlertType("error");
        setAlertVisible(true);
      }
    } catch (error) {
      setAlertMessage("An error occurred.");
      setAlertType("error");
      setAlertVisible(true);
    }
  };

  useEffect(() => {
    if (eventId) {
      apiClient
        .get(`/calendar/${eventId}`)
        .then((res) => {
          if (res.status === 200) {
            const data = res.data;
            setTitle(data.title || "");
            setDate(reverseDateFormat(data.startDate) || "YYYY-MM-DD");
            setStartingTime(data.startTime || "HH:MM");
            setEndingTime(data.endTime || "HH:MM");
            setIsSwitchOn(data.notifyParticipants || false);
            setmenuid(data.allDay ? 2 : 1); // Assuming 2 = All Day

            // Set unregistered emails
            setEmails(data.unregisteredEmails || []);

            // Combine both user and client participants into selectedContacts
            const formattedContacts = [
              ...(data.userParticipants || []).map((user) => ({
                id: user.id,
                email: user.email || "",
                status: "colleague",
              })),
              ...(data.clientParticipants || []).map((client) => ({
                id: client.id,
                email: client.email,
                status: "customer",
              })),
            ];
            setSelectedContacts(formattedContacts);
          }
        })
        .catch((error) => {
          console.log("Error fetching event:", error);
          setAlertMessage("Failed to load event data.");
          setAlertType("error");
          setAlertVisible(true);
        });
    }
  }, [eventId]);

  const handleDelete = async () => {
    setIsDelModalVisible(false);

    try {
      const response = await apiClient.delete(`/calendar/${eventId}`);
      if (response.status === 204) {
        setAlertMessage("Event deleted successfully");
        setAlertType("error");
        setAlertVisible(true);
        setTimeout(() => {
          navigation.navigate("CalendarEvent", { refresh: true });
        }, 4000); // 5000 ms = 5 seconds
      } else {
        setAlertMessage("Failed to delete event");
        setAlertType("error");
        setAlertVisible(true);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      setAlertMessage("An error occurred while deleting");
      setAlertType("error");
      setAlertVisible(true);
    }
  };

  return (
    // <Screen style={styles.screen}>
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 2 : 0}
    >
      <ScrollView
        ref={scrollRef}
        style={{ width: "100%" }}
        contentContainerStyle={{
          alignItems: "center",
          paddingBottom: 80,
          marginTop: Platform.OS === "ios" ? RFPercentage(5) : 0,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false} // ✅ disables bounce on iOS
        overScrollMode="never" // ✅ disables overscroll glow on Android
      >
        <CommonHeader
          title={eventId ? "Manage Event" : "Create Event"}
          onBackPress={() => navigation.goBack()}
        />
        <View style={{ marginTop: RFPercentage(2) }} />
        <InputField
          title={"Title"}
          placeTitle={"Enter Title"}
          value={title}
          onChange={setTitle}
        />

        <DatePicker
          titleSize={RFPercentage(1.6)}
          width={"90%"}
          borderColor={Colors.stroke}
          isTimePicker={false}
          label="Starting Date"
          placeholder={date}
          value={eventId ? date : undefined}
          onDateChange={handleDateChange}
          error={error}
          setError={setError}
          icon={"calendar-month-outline"}
        />

        <View style={{ marginVertical: RFPercentage(4), width: "70%" }}>
          <AppLine />
        </View>

        {/* Radio */}
        <RadioButton
          options={selectTime}
          selectedId={menuid}
          onChange={(id) => setmenuid(id)}
        />

        {/* time picker */}
        {menuid === 1 && (
          <View
            style={{
              flexDirection: "row",
              width: "90%",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginTop: RFPercentage(1),
            }}
          >
            <DatePicker
              width={"48%"}
              titleSize={RFPercentage(1.6)}
              borderColor={Colors.stroke}
              isTimePicker={true}
              label="Starting Time"
              placeholder={startingTime}
              value={eventId ? startingTime : undefined}
              onTimeChange={(value) => handleTimeChange(value, "startTime")}
              error={error}
              setError={setError}
              icon={"clock-time-four-outline"}
            />
            <DatePicker
              width={"48%"}
              titleSize={RFPercentage(1.6)}
              isTimePicker={true}
              borderColor={Colors.stroke}
              label="Ending Time"
              placeholder={endingTime}
              value={eventId ? endingTime : undefined}
              onTimeChange={(value) => handleTimeChange(value, "endTime")}
              error={error}
              setError={setError}
              icon={"clock-time-four-outline"}
            />
          </View>
        )}
        <View style={{ marginVertical: RFPercentage(4), width: "70%" }}>
          <AppLine />
        </View>

        <View style={styles.container}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.label}>Contacts</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate("ExistingContactsScreen", {
                  preSelectedContacts: selectedContacts,
                  ...(eventId && { eventId }),
                })
              }
            >
              <Text style={[styles.label, { fontFamily: FontFamily.medium }]}>
                Add Existing
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <ScrollView
              horizontal
              contentContainerStyle={styles.emailList}
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {emails.map((email, index) => (
                <View key={index} style={styles.emailTag}>
                  <Text style={styles.emailText}>{email}</Text>
                  <TouchableOpacity onPress={() => handleRemoveEmail(index)}>
                    <Text style={styles.removeIcon}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TextInput
                onFocus={() => {
                  scrollRef.current?.scrollToEnd({ animated: true }); // ✅ Auto scroll input into view
                }}
                value={emailInput}
                onChangeText={handleInputChange}
                placeholder="Type & Select multiple contacts"
                placeholderTextColor={Colors.stroke}
                style={styles.textInput}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </ScrollView>
          </View>
          <Text
            style={{
              color: Colors.darkgrey,
              fontFamily: FontFamily.regular,
              fontSize: RFPercentage(1.1),
              marginTop: RFPercentage(0.5),
            }}
          >
            Hint: Type an email and press space, or select multiple contacts
          </Text>
        </View>

        {/* notification */}
        <View
          style={{
            width: "90%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: RFPercentage(3),
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Fontisto
              color={Colors.blacksuit}
              style={{ marginRight: RFPercentage(1) }}
              size={20}
              name={"bell"}
            />
            <Text
              style={{
                color: Colors.blacksuit,
                fontFamily: FontFamily.regular,
                fontSize: RFPercentage(1.6),
              }}
            >
              Send Notification to participants
            </Text>
          </View>

          <Switch
            value={isSwitchOn}
            onValueChange={toggleSwitch}
            thumbColor={"#fff"}
            trackColor={{
              false: Colors.grey, // when off
              true: Colors.primary, // when on
            }}
          />
        </View>

        {eventId ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "90%",
              marginTop: RFPercentage(13),
            }}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsDelModalVisible(true)}
              style={[
                {
                  backgroundColor: Colors.red,
                  marginRight: 13,
                },
                styles.buttonContainer,
              ]}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleSubmit}
              style={[
                {
                  backgroundColor: Colors.primary,
                },
                styles.buttonContainer,
              ]}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.loginbutton}
            activeOpacity={0.7}
          >
            <AppButton title={"Save"} buttonColor={Colors.primary} />
          </TouchableOpacity>
        )}

        {/* modal */}
        <CommonModal
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          image={icons.qstn}
          title={"Would you like to send notification to the client/s ?"}
          buttonpri={"Send"}
          buttonsec={"Cancel"}
          onpressPri={() => {
            // Keep switch ON, just close modal
            setIsModalVisible(false);
            // ✅ Add your send logic here
          }}
          onpressSec={() => {
            // Cancel: turn switch OFF + close modal
            setIsModalVisible(false);
            setIsSwitchOn(false);
          }}
        />

        {/* modal */}
        <CommonModal
          isModalVisible={isDelModalVisible}
          setIsModalVisible={setIsDelModalVisible}
          image={icons.redqstn}
          title={"Are you sure you want to Delete the Event ?"}
          buttonpri={"Yes"}
          buttonsec={"Cancel"}
          onpressPri={handleDelete}
          onpressSec={() => {
            setIsDelModalVisible(false);
          }}
        />

        {/* Alert */}
        <CustomAlert
          message={alertMessage}
          visible={alertVisible}
          type={alertType} // "success" or "error"
          onClose={() => setAlertVisible(false)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
    // </Screen>
  );
};

export default CreateEventScreen;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  loginbutton: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: RFPercentage(10),
  },
  textInput: {
    minWidth: RFPercentage(34),
    color: Colors.blacksuit,
    fontSize: RFPercentage(1.4),
    fontFamily: FontFamily.regular,
  },

  //
  container: {
    width: "90%",
  },
  label: {
    fontSize: RFPercentage(1.6),
    fontFamily: FontFamily.regular,
    marginBottom: RFPercentage(1),
    color: Colors.blacksuit,
  },
  inputContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.stroke,
    padding: RFPercentage(1.5),
    borderRadius: RFPercentage(1),
    backgroundColor: Colors.white,
  },
  emailList: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap",
  },
  emailTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.lightgrey,
    paddingHorizontal: RFPercentage(1),
    borderRadius: RFPercentage(1),
    marginRight: RFPercentage(1),
  },
  emailText: {
    color: Colors.blacky,
    fontFamily: FontFamily.regular,
    fontSize: RFPercentage(1.4),
    marginRight: 5,
  },
  removeIcon: {
    color: Colors.danger,
    fontSize: RFPercentage(1.5),
    fontWeight: "bold",
  },

  buttonContainer: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.white,
    fontFamily: FontFamily.regular,
    fontSize: RFPercentage(1.8),
  },
});
