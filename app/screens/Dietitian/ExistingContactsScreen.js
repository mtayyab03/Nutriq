import React, { useState, useEffect } from "react";
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

//Components
import Screen from "../../components/Screen";
import CommonHeader from "../../components/common/CommonHeader";
import SearchField from "../../components/SearchField";
import AppLine from "../../components/AppLine";

// apis
import apiClient from "../../apis/apiClient";

//config
import icons from "../../config/icons";
import Colors from "../../config/Colors";
import { FontFamily } from "../../config/font";

const ExistingContactsScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null);
  const categories = [
    "Customer",
    "Colleague",
    "Ascending order",
    "Descending order",
    "Last Registered",
  ];
  const contacts = [
    {
      id: 1,
      name: "Alish Maize",
      mail: "alish@gmail.com",
      image: icons.profile1,
      status: "customer",
      registerDate: "12-04-2025",
    },
    {
      id: 2,
      name: "Bella Rose",
      mail: "bellarose@gmail.com",
      image: icons.profile2,
      status: "colleague",
      registerDate: "11-05-2025",
    },
    {
      id: 3,
      name: "Maline Kim ",
      mail: "malinekim@gmail.com",
      image: icons.profile3,
      status: "colleague",
      registerDate: "03-05-2025",
    },
    {
      id: 4,
      name: "Elina Shrose",
      mail: "elinashrose@gmail.com",
      image: icons.profile1,
      status: "colleague",
      registerDate: "03-05-2025",
    },
    {
      id: 5,
      name: "Sara Khaleel",
      mail: "sarakhaleel@gmail.com",
      image: icons.profile3,
      status: "colleague",
      registerDate: "03-05-2025",
    },
  ];

  // Apply filters + search
  const getFilteredContacts = () => {
    let filtered = [...contacts];

    // Apply filters
    if (selectedFilter === "Customer") {
      filtered = filtered.filter((c) => c.status === "customer");
    } else if (selectedFilter === "Colleague") {
      filtered = filtered.filter((c) => c.status === "colleague");
    } else if (selectedFilter === "Ascending order") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (selectedFilter === "Descending order") {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else if (selectedFilter === "Last Registered") {
      filtered.sort(
        (a, b) =>
          new Date(b.registerDate.split("-").reverse().join("-")) -
          new Date(a.registerDate.split("-").reverse().join("-"))
      );
    }

    // Apply search
    if (searchText.trim() !== "") {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchText.toLowerCase()) ||
          c.mail.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredContacts = getFilteredContacts();

  return (
    <Screen style={styles.screen}>
      <CommonHeader title="Contacts" onBackPress={() => navigation.goBack()} />
      <View style={{ marginTop: RFPercentage(1) }} />
      <SearchField
        title="Search"
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />

      <View
        style={{
          width: "100%",
          marginVertical: RFPercentage(2),
        }}
      >
        <ScrollView
          style={{ width: "100%" }}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            marginLeft: RFPercentage(2),
            paddingRight: RFPercentage(2),
          }}
        >
          {categories.map((item) => (
            <TouchableOpacity
              activeOpacity={0.7}
              key={item}
              onPress={() =>
                setSelectedFilter(item === selectedFilter ? null : item)
              }
              style={[
                styles.button,
                {
                  backgroundColor:
                    selectedFilter === item ? Colors.primary : "transparent",
                  borderColor:
                    selectedFilter === item ? Colors.primary : Colors.stroke,
                },
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    color:
                      selectedFilter === item ? Colors.white : Colors.blacksuit,
                  },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <AppLine />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
      >
        {filteredContacts.map((item, index) => (
          <TouchableOpacity
            activeOpacity={0.7}
            key={index}
            style={{ width: "100%", alignItems: "center" }}
          >
            <View style={styles.mainContainer}>
              <Image
                style={{
                  width: RFPercentage(6),
                  height: RFPercentage(6),
                  borderRadius: RFPercentage(5),
                }}
                source={item.image}
              />
              <View style={{ marginLeft: RFPercentage(1.5) }}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.secTitle}>{item.mail}</Text>
              </View>
            </View>
            <View
              style={{
                width: "90%",
                backgroundColor: Colors.lightWhite,
                height: RFPercentage(0.06),
                marginTop: RFPercentage(2),
              }}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Screen>
  );
};

export default ExistingContactsScreen;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  button: {
    paddingVertical: RFPercentage(1),
    paddingHorizontal: RFPercentage(2.5),
    borderRadius: RFPercentage(3),
    borderWidth: 1,
    marginRight: RFPercentage(1.5),
  },
  buttonText: {
    fontSize: RFPercentage(1.5),
    fontFamily: FontFamily.regular,
  },
  mainContainer: {
    flexDirection: "row",
    width: "90%",
    alignItems: "center",
    marginTop: RFPercentage(2),
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
  scrollContent: {
    paddingBottom: RFPercentage(5),
    alignItems: "center",
    justifyContent: "center",
  },
});
