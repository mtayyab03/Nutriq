import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";
import { RFPercentage } from "react-native-responsive-fontsize";

//config
import icons from "../config/icons";
import Colors from "../config/Colors";
import { FontFamily } from "../config/font";

const DatePicker = ({
  label = "Starting Date",
  placeholder,
  onDateChange,
  error,
  setError,
}) => {
  const [date, setDate] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate) => {
    hideDatePicker();
    const formattedDate = `${selectedDate.getFullYear()}-${(
      selectedDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${selectedDate.getDate().toString().padStart(2, "0")}`;
    setDate(formattedDate);
    setSelectedDate(selectedDate);
    if (onDateChange) {
      onDateChange(formattedDate); // Pass the formatted date to the parent component
    }
  };

  return (
    <View style={{ width: "48%", marginTop: RFPercentage(1) }}>
      <Text
        style={{
          marginTop: RFPercentage(0.7),
          color: Colors.grey,
          fontFamily: FontFamily.medium,
          fontSize: RFPercentage(1.2),
        }}
      >
        {label}
      </Text>
      <View
        style={{
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
        }}
      >
        <TextInput
          onChangeText={(text) => {
            setDate(text);
            if (setError) {
              setError((prev) => ({
                ...prev,
                date: false,
              }));
            }
          }}
          value={date}
          placeholder={placeholder}
          placeholderTextColor={Colors.placeholder}
          style={styles.textInput}
          editable={false} // Prevent manual editing
        />
        <TouchableOpacity
          activeOpacity={0.7}
          // onPress={showDatePicker}
          style={styles.calendarIcon}
        >
          <Feather name="calendar" size={20} color={Colors.gray} />
        </TouchableOpacity>
      </View>

      {Platform.OS === "ios" ? (
        <Modal transparent visible={isDatePickerVisible} animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="inline"
                onChange={(event, date) => {
                  if (date) handleConfirm(date);
                }}
              />
              {/* <TouchableOpacity
                onPress={hideDatePicker}
                style={styles.doneButton}
              >
                <Text style={styles.doneText}>Done</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </Modal>
      ) : (
        isDatePickerVisible && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              if (date) handleConfirm(date);
            }}
          />
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    color: Colors.blacksuit,
    fontSize: RFPercentage(1.4),
    fontFamily: FontFamily.regular,
  },
  calendarIcon: {
    marginLeft: RFPercentage(1),
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: Colors.white,
    padding: RFPercentage(2),
    borderRadius: RFPercentage(1.5),
    alignItems: "center",
  },
  doneButton: {
    marginTop: RFPercentage(2),
    padding: RFPercentage(1),
    backgroundColor: Colors.primary,
    borderRadius: RFPercentage(1),
  },
  doneText: {
    color: Colors.white,
    fontSize: RFPercentage(1.6),
    fontFamily: FontFamily.medium,
  },
});

export default DatePicker;
