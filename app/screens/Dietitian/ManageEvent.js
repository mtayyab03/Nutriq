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

//Components
import Screen from "../../components/Screen";
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

const ManageEvent = ({ navigation }) => {
  const [title, setTitle] = useState(""); // Add loading state
  const [startingDate, setStartingDate] = useState("YYYY-MM-DD");
  const [date, setDate] = useState("");
  const [error, setError] = useState({ date: false });
  const [menuid, setmenuid] = useState(1);

  const [startingTime, setStartingTime] = useState("HH:MM");
  const [endingTime, setEndingTime] = useState("HH:MM");
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDelModalVisible, setIsDelModalVisible] = useState(false);

  const toggleSwitch = () => {
    setIsSwitchOn((prev) => !prev);
    if (!isSwitchOn) {
      setIsModalVisible(true); // Show modal only when switching ON
    }
  };

  const handleDateChange = (formattedDate) => {
    setDate(formattedDate);
    console.log("Selected Date:", formattedDate);
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
    setEmails(emails.filter((_, i) => i !== index));
  };
  return (
    <Screen style={styles.screen}>
      <CommonHeader
        title="Manage Event"
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
          onDateChange={handleDateChange}
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
          onDateChange={handleDateChange}
          error={error}
          setError={setError}
          icon={"clock-time-four-outline"}
        />
      </View>

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
            onPress={() => navigation.navigate("ExistingContactsScreen")}
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

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "90%",
          marginTop: RFPercentage(10),
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary,
            paddingVertical: 13,
            paddingHorizontal: 20,
            borderRadius: 10,
            marginRight: 10,
            flex: 1,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: Colors.white,
              fontFamily: FontFamily.regular,
              fontSize: RFPercentage(1.8),
            }}
          >
            Edit
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsDelModalVisible(true)}
          style={{
            backgroundColor: Colors.red,
            paddingVertical: 13,
            paddingHorizontal: 20,
            borderRadius: 10,
            flex: 1,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: Colors.white,
              fontFamily: FontFamily.regular,
              fontSize: RFPercentage(1.8),
            }}
          >
            Delete
          </Text>
        </TouchableOpacity>
      </View>

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
        onpressPri={() => {
          // Keep switch ON, just close modal
          setIsDelModalVisible(false);
          // ✅ Add your send logic here
        }}
        onpressSec={() => {
          // Cancel: turn switch OFF + close modal
          setIsDelModalVisible(false);
        }}
      />
    </Screen>
  );
};

export default ManageEvent;
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
