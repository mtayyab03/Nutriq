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
import {
  Ionicons,
  Fontisto,
  MaterialCommunityIcons,
  AntDesign,
  Feather,
} from "@expo/vector-icons";

//Components
import Screen from "../../components/Screen";
import AppButton from "../../components/AppButton";
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
  return (
    <Screen style={styles.screen}>
      <CommonHeader title="Contacts" onBackPress={() => navigation.goBack()} />
      <View style={{ marginTop: RFPercentage(1) }} />
      <SearchField
        title="Search"
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />
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
});
