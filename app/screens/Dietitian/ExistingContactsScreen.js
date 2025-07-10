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
import { Ionicons, Feather } from "@expo/vector-icons";

//Components
import Screen from "../../components/Screen";
import CommonHeader from "../../components/common/CommonHeader";
import SearchField from "../../components/SearchField";
import AppLine from "../../components/AppLine";
import AppButton from "../../components/AppButton";
import AppModal from "../../components/common/AppModal";
import AppLoading from "../../components/AppLoading";

// apis
import apiClient from "../../apis/apiClient";

//config
import icons from "../../config/icons";
import Colors from "../../config/Colors";
import { FontFamily } from "../../config/font";

const ExistingContactsScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [allContacts, setAllContacts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState(null); // e.g., "customer"
  const [selectedSortFilter, setSelectedSortFilter] = useState(null); // e.g., "asc"
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
      } finally {
        setLoading(false); // ✅ stop loading
      }
    };

    fetchContacts();
  }, []);

  const filters = [
    { id: 1, label: "Customer", type: "status", value: "customer" },
    { id: 2, label: "Colleague", type: "status", value: "colleague" },
    { id: 3, label: "Ascending order", type: "sort", value: "asc" },
    { id: 4, label: "Descending order", type: "sort", value: "desc" },
    { id: 5, label: "Last Registered", type: "sort", value: "latest" },
  ];

  // Apply filters + search
  const getFilteredContacts = () => {
    let filtered = [...allContacts];

    // Status filter
    if (selectedStatusFilter) {
      filtered = filtered.filter((c) => c.status === selectedStatusFilter);
    }

    // Sort filter
    if (selectedSortFilter === "asc") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (selectedSortFilter === "desc") {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else if (selectedSortFilter === "latest") {
      filtered.sort(
        (a, b) => new Date(b.registerDate) - new Date(a.registerDate)
      );
    }

    // Search filter
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
          flexDirection: "row",
          width: "90%",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            width: "60%",
            marginVertical: RFPercentage(2),
            flexDirection: "row",
          }}
        >
          {filters
            .filter((f) => f.type === "status")
            .map((item) => (
              <TouchableOpacity
                activeOpacity={0.7}
                key={item.id}
                onPress={() =>
                  setSelectedStatusFilter(
                    selectedStatusFilter === item.value ? null : item.value
                  )
                }
                style={[
                  styles.button,
                  {
                    backgroundColor:
                      selectedStatusFilter === item.value
                        ? Colors.primary
                        : "transparent",
                    borderColor:
                      selectedStatusFilter === item.value
                        ? Colors.primary
                        : Colors.stroke,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color:
                        selectedStatusFilter === item.value
                          ? Colors.white
                          : Colors.blacksuit,
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
        </View>

        {/* Filter Icon - always on top */}

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setIsModalVisible((prev) => !prev)}
        >
          <Ionicons color={Colors.blacky} size={28} name={"filter"} />
        </TouchableOpacity>
      </View>
      <AppLine />

      {loading ? (
        <AppLoading />
      ) : (
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
      )}

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
            name: c.name,
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

      {/* modal */}
      <AppModal
        modalVisible={isModalVisible}
        setModalVisible={setIsModalVisible}
        style={{
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "transparent", // ensure no opaque background
          zIndex: 1,
        }}
        RecStyle={{
          width: "40%",
          padding: RFPercentage(1),
          borderRadius: RFPercentage(0.5),
          position: "absolute",
          top: "25%",
          right: RFPercentage(2),
        }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setIsModalVisible(false);
          }}
          style={{ width: "100%", alignItems: "flex-end" }}
        >
          <Ionicons color={Colors.blacky} size={20} name={"close"} />
        </TouchableOpacity>
        {filters
          .filter((f) => f.type === "sort")
          .map((filter) => (
            <TouchableOpacity
              key={filter.id}
              activeOpacity={0.7}
              onPress={() => {
                setSelectedSortFilter(
                  selectedSortFilter === filter.value ? null : filter.value
                );
                setIsModalVisible(false);
              }}
            >
              <Text
                style={{
                  marginVertical: 5,
                  color: Colors.blacky,
                  fontFamily: FontFamily.regular,
                  fontSize: RFPercentage(1.5),
                }}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
      </AppModal>
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
