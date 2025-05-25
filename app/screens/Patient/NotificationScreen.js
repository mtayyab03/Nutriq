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
import { AntDesign, Ionicons } from "@expo/vector-icons";

//Cdnesdayomponents
import Screen from "../../components/Screen";

// apis
import apiClient from "../../apis/apiClient";

//config
import Colors from "../../config/Colors";
import { FontFamily } from "../../config/font";
import icons from "../../config/icons";

const NotificationScreen = ({ navigation }) => {
  const appointments = [
    {
      title: "Nutrition assessment booked on May 26",
      date: "01/03/2025",
      icon: "chatbox-ellipses-outline",
    },
    {
      title: "Follow-up call scheduled for June 2",
      date: "02/03/2025",
      icon: "call-outline",
    },
    {
      title: "Diet plan emailed",
      date: "03/03/2025",
      icon: "mail-outline",
    },
    {
      title: "Initial consultation confirmed for August 15",
      date: "15/08/2025",
      icon: "chatbox-ellipses-outline",
    },
    {
      title: "Progress review call scheduled for Sep 3",
      date: "03/09/2025",
      icon: "call-outline",
    },
    {
      title: "Personalized meal plan delivered",
      date: "05/09/2025",
      icon: "mail-outline",
    },
  ];
  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.leftIcon}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <AntDesign color={Colors.blacky} size={24} name={"arrowleft"} />
        </TouchableOpacity>

        <Text style={styles.title}>Notification</Text>

        {/* Invisible view to balance the layout */}
        <TouchableOpacity style={styles.rightIcon} activeOpacity={0.7}>
          <AntDesign color={Colors.blacky} size={24} name={"questioncircleo"} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
      >
        {appointments.map((item, index) => (
          <View key={index} style={styles.mainContainer}>
            <View style={styles.iconContainer}>
              <Ionicons color={Colors.primary} size={24} name={item.icon} />
            </View>
            <View style={{ marginLeft: RFPercentage(1.5) }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.secTitle}>{item.date}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
};

export default NotificationScreen;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  container: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: RFPercentage(1.5),
  },
  leftIcon: {
    width: 40, // same width as right placeholder to center text
    alignItems: "flex-start",
  },
  scrollContent: {
    paddingBottom: RFPercentage(5),
    alignItems: "center",
    justifyContent: "center",
  },
  rightIcon: {
    width: 40, // keeps title centered
  },
  title: {
    color: Colors.blacky,
    fontFamily: FontFamily.medium,
    fontSize: RFPercentage(2),
  },
  mainContainer: {
    flexDirection: "row",
    width: "90%",
    alignItems: "center",
    marginTop: RFPercentage(3),
  },
  iconContainer: {
    width: RFPercentage(5),
    height: RFPercentage(5),
    borderRadius: RFPercentage(3),
    backgroundColor: Colors.lightWhite,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: Colors.blacky,
    fontFamily: FontFamily.medium,
    fontSize: RFPercentage(1.5),
  },
  secTitle: {
    marginTop: RFPercentage(0.5),
    color: Colors.blacksuit,
    fontFamily: FontFamily.regular,
    fontSize: RFPercentage(1.3),
  },
});
