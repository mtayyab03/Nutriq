import React, { useState, useEffect } from "react";
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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RFPercentage } from "react-native-responsive-fontsize";

//config
import icons from "../config/icons";
import Colors from "../config/Colors";
import { FontFamily } from "../config/font";

const DatePicker = ({
  label = "Starting Date",
  placeholder,
  value,
  onDateChange,
  onTimeChange, // ➕ New prop
  isTimePicker = false, // ➕ Prop to control time/date mode
  error,
  setError,
  borderColor,
  width,
  titleSize,
  icon,
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
  // 👇 Sync selectedDate when value (from API) changes
  useEffect(() => {
    if (!value) return;

    if (isTimePicker) {
      // If time is passed as "HH:MM"
      const [hour, minute] = value.split(":").map(Number);
      if (!isNaN(hour) && !isNaN(minute)) {
        const now = new Date();
        const parsedTime = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          hour,
          minute
        );
        setSelectedDate(parsedTime); // ⏱ default selected time
        setDate(value); // ⏱ visible in TextInput
      }
    } else {
      // If date is passed as "DD-MM-YYYY"
      const [day, month, year] = value.split("-").map(Number);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        const parsedDate = new Date(year, month - 1, day);
        setSelectedDate(parsedDate); // 📅 default selected date
        setDate(value); // 📅 visible in TextInput
      }
    }
  }, [value, isTimePicker]);

  const handleConfirm = (selected) => {
    hideDatePicker();
    setSelectedDate(selected);

    if (isTimePicker) {
      const formattedTime = selected.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setDate(formattedTime);
      if (onTimeChange) onTimeChange(formattedTime);
    } else {
      const day = selected.getDate().toString().padStart(2, "0");
      const month = (selected.getMonth() + 1).toString().padStart(2, "0");
      const year = selected.getFullYear();
      const formattedDate = `${day}-${month}-${year}`; // 👈 Reversed forma
      setDate(formattedDate);
      if (onDateChange) onDateChange(formattedDate);
    }
  };
  return (
    <View style={{ width: width, marginTop: RFPercentage(1) }}>
      <Text
        style={{
          marginTop: RFPercentage(0.7),
          color: Colors.blacksuit,
          fontFamily: FontFamily.regular,
          fontSize: titleSize,
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
          borderColor: borderColor,
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
          placeholderTextColor={Colors.blacky}
          style={styles.textInput}
          editable={false} // Prevent manual editing
        />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={showDatePicker}
          style={styles.calendarIcon}
        >
          <MaterialCommunityIcons name={icon} size={20} color={Colors.gray} />
        </TouchableOpacity>
      </View>

      {Platform.OS === "ios" ? (
        <Modal transparent visible={isDatePickerVisible} animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <DateTimePicker
                value={selectedDate}
                mode={isTimePicker ? "time" : "date"}
                display={isTimePicker ? "spinner" : "inline"}
                minuteInterval={5}
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
            mode={isTimePicker ? "time" : "date"}
            display="default"
            minuteInterval={5}
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
    color: Colors.blacky,
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
