import React, { useState, useEffect } from "react";
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Switch,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Fontisto } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

//Components
import Screen from "../../components/Screen";
import AppButton from "../../components/AppButton";
import CommonHeader from "../../components/common/CommonHeader";
import InputField from "../../components/InputField";
import DatePicker from "../../components/DatePicker";
import AppLine from "../../components/AppLine";
import RadioButton from "../../components/common/RadioButton";
import CommonModal from "../../components/Specific/CommonModal";

// apis
import apiClient from "../../apis/apiClient";

//config
import icons from "../../config/icons";
import Colors from "../../config/Colors";
import { FontFamily } from "../../config/font";

const CreateEventScreen = ({ navigation, route }) => {
  const [title, setTitle] = useState(""); // Add loading state
  const [startingDate, setStartingDate] = useState("YYYY-MM-DD");
  const [date, setDate] = useState("");
  const [error, setError] = useState({ date: false });
  const [menuid, setmenuid] = useState(1);

  const [startingTime, setStartingTime] = useState("HH:MM");
  const [endingTime, setEndingTime] = useState("HH:MM");
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]); // [{ id, email }]

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
    if (!timePart || !modifier) return "00:00:00"; // fallback

    const [hStr, mStr] = timePart.split(":");
    let hours = parseInt(hStr, 10);
    let minutes = parseInt(mStr, 10);

    if (modifier.toLowerCase() === "pm" && hours < 12) hours += 12;
    if (modifier.toLowerCase() === "am" && hours === 12) hours = 0;

    const hh = hours.toString().padStart(2, "0");
    const mm = minutes.toString().padStart(2, "0");

    return `${hh}:${mm}:00`;
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

  useFocusEffect(
    React.useCallback(() => {
      const contacts = route?.params?.selectedContacts || [];

      if (contacts.length > 0) {
        setSelectedContacts(contacts); // stores id + email
        setEmails(contacts.map((c) => c.email)); // stores only emails
      }
    }, [route?.params?.selectedContacts])
  );

  const handleSubmit = async () => {
    if (!date === "YYYY-MM-DD") {
      alert("Please fill correct in the required fields.");
      return;
    }

    try {
      const allDay = menuid === 2;

      // Separate userParticipants and clientParticipants based on contact status
      const userParticipants = selectedContacts
        .filter((c) => c.status === "colleague")
        .map((c) => c.id);

      const clientParticipants = selectedContacts
        .filter((c) => c.status === "customer")
        .map((c) => c.id);

      // Get emails of all registered contacts
      const registeredEmails = selectedContacts.map((c) => c.email);

      // Filter out already registered emails from `emails`
      const filteredUnregisteredEmails = emails.filter(
        (email) => !registeredEmails.includes(email)
      );

      console.log("Raw Times => Start:", startingTime, "| End:", endingTime);
      const payload = {
        title: title,
        startDate: date,
        allDay: allDay,
        notifyParticipants: isSwitchOn,
        unregisteredEmails: filteredUnregisteredEmails,
        userParticipants,
        clientParticipants,
      };

      if (!allDay) {
        payload.startTime = `${startingTime}`; // Format: HH:MM:SS
        payload.endTime = `${endingTime}`;
      }

      console.log("Sending payload:", payload);

      const response = await apiClient.post("/calendar", payload);

      if (response.status === 201) {
        alert("Event created successfully!");
        navigation.navigate("CalendarEvent"); // or navigate wherever needed
      } else {
        console.log("Error:", response.data);
        alert("Failed to create event.");
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("An error occurred.");
    }
  };

  return (
    <Screen style={styles.screen}>
      <CommonHeader
        title="Create Event"
        onBackPress={() => navigation.goBack()}
      />
      <View style={{ marginTop: RFPercentage(2) }} />
      <InputField
        title={"Title"}
        placeTitle={"Enter Title "}
        value={title}
        onChange={setTitle}
      />

      <DatePicker
        titleSize={RFPercentage(1.6)}
        width={"90%"}
        borderColor={Colors.stroke}
        isTimePicker={false}
        label="Starting Date"
        placeholder={startingDate}
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

      <TouchableOpacity
        onPress={handleSubmit}
        style={[
          styles.loginbutton,
          { position: "absolute", bottom: RFPercentage(6) },
        ]}
        activeOpacity={0.7}
      >
        <AppButton title={"Save"} buttonColor={Colors.primary} />
      </TouchableOpacity>

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
    </Screen>
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
    marginTop: RFPercentage(1.5),
  },
  textInput: {
    // flex: 1,
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
  textInput: {
    minWidth: 120,
    fontSize: RFPercentage(1.4),
    fontFamily: FontFamily.regular,
    color: Colors.blacktext,
  },
});
