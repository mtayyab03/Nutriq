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
import { useRoute } from "@react-navigation/native";
//Components
import Screen from "../../components/Screen";
import CommonHeader from "../../components/common/CommonHeader";
import SearchField from "../../components/SearchField";
import AppLine from "../../components/AppLine";
import AppButton from "../../components/AppButton";

// apis
import apiClient from "../../apis/apiClient";

//config
import icons from "../../config/icons";
import Colors from "../../config/Colors";
import { FontFamily } from "../../config/font";

const ExistingContactsScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]); // store selected contact IDs

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        // Step 1: Get current user profile
        const profileRes = await apiClient.get("/users/profile");
        const currentUserEmail = profileRes.data.email;

        // Step 2: Fetch colleagues and customers in parallel
        const [colleagueRes, customerRes] = await Promise.all([
          apiClient.get("/users/company/members"),
          apiClient.get("/clients"),
        ]);

        // Step 3: Map and filter colleagues (exclude current user)
        const colleagues = colleagueRes.data
          .filter((item) => item.email !== currentUserEmail) // ❌ filter current user
          .map((item) => ({
            id: item.id,
            name: `${item.firstName} ${item.lastName}`,
            mail: item.email,
            image: item.avatar ? { uri: item.avatar } : icons.dumprofile,
            status: "colleague",
            registerDate: new Date(item.createdAt).toISOString().split("T")[0],
          }));

        // Step 4: Map customers
        const customers = customerRes.data.content.map((item) => ({
          id: item.id,
          name: `${item.firstName} ${item.lastName}`,
          mail: item.email,
          image: item.managedBy?.avatar
            ? { uri: item.managedBy.avatar }
            : icons.dumprofile,
          status: "customer",
          registerDate: "N/A",
        }));

        // Step 5: Set final contacts
        setAllContacts([...colleagues, ...customers]);
      } catch (error) {
        console.error("Error fetching contacts or user profile:", error);
      }
    };

    fetchContacts();
  }, []);

  const categories = [
    "Customer",
    "Colleague",
    "Ascending order",
    "Descending order",
    "Last Registered",
  ];

  // Apply filters + search
  const getFilteredContacts = () => {
    let filtered = [...allContacts];

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
        (a, b) => new Date(b.registerDate) - new Date(a.registerDate)
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

  const toggleContactSelection = (id) => {
    setSelectedContacts((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((contactId) => contactId !== id)
        : [...prevSelected, id]
    );
  };

  const route = useRoute();
  const preSelected = route.params?.preSelectedContacts || [];

  useEffect(() => {
    if (preSelected.length > 0) {
      setSelectedContacts(preSelected.map((c) => c.id));
    }
  }, [preSelected]);

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
            onPress={() => toggleContactSelection(item.id)}
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

              {selectedContacts.includes(item.id) && (
                <Text
                  style={{
                    marginLeft: "auto",
                    color: Colors.primary,
                    fontWeight: "bold",
                    fontSize: RFPercentage(2),
                  }}
                >
                  ✓
                </Text>
              )}
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

      <TouchableOpacity
        style={[
          styles.loginbutton,
          { position: "absolute", bottom: RFPercentage(6) },
        ]}
        activeOpacity={0.7}
        onPress={() => {
          const selected = allContacts.filter((c) =>
            selectedContacts.includes(c.id)
          );
          const selectedMapped = selected.map((c) => ({
            id: c.id,
            email: c.mail,
            status: c.status,
          }));

          navigation.navigate("CreateEventScreen", {
            selectedContacts: selectedMapped,
            ...(route.params?.eventId && { eventId: route.params.eventId }),
          });
        }}
      >
        <AppButton title={"Save"} buttonColor={Colors.primary} />
      </TouchableOpacity>
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
    paddingRight: RFPercentage(3),
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

  loginbutton: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: RFPercentage(1.5),
  },
});
