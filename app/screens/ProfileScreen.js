import React, { useState, useEffect } from "react";
import {
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Platform,
  TextInput,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Fontisto,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

//config
import Colors from "../config/Colors";
import { FontFamily } from "../config/font";
import icons from "../config/icons";

// apis
import apiClient from "../apis/apiClient";

// component
import TitleFieldRow from "../components/TitleFieldRow";
import AppButton from "../components/AppButton";

const Profilescreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [surName, setSurName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await apiClient.get("/users/profile");
        const userData = response.data;

        setFirstName(userData.firstName || "");
        setSurName(userData.lastName || "");
        setEmail(userData.email || "");
        setDescription(userData.shortDescription || "");
        setBio(userData.bio || "");
        setSelectedImage(userData.avatar ? { uri: userData.avatar } : null);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const pickImage = async () => {
    // Request permission to access the camera roll
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Camera roll permissions are required.");
      return;
    }

    // Open image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setSelectedImage(result.assets[0].uri); // Set the selected image
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken"); // ✅ Clear token
      navigation.reset({
        index: 0,
        routes: [{ name: "LoginScreen" }], // 👈 Update to your login screen name
      });
    } catch (error) {
      Alert.alert(
        "Logout Failed",
        "Something went wrong while logging out. Please try again."
      );
    }
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: Colors.white,
      }}
    >
      <LinearGradient
        colors={[Colors.lightgreen, Colors.primary]} // Define your two gradient colors here
        start={{ x: 0, y: 0 }} // Start point (top-left)
        end={{ x: 1, y: 1 }} // End point (bottom-right)
        style={{
          width: "100%",
          height: Platform.OS == "ios" ? RFPercentage(28) : RFPercentage(26),
          alignItems: "center",
          borderBottomLeftRadius: RFPercentage(5),
          borderBottomRightRadius: RFPercentage(5),
        }}
      >
        <View
          style={{
            width: "80%",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            bottom: RFPercentage(3),
          }}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate("NotificationScreen")}
            style={{
              width: "100%",
              alignItems: "flex-end",
            }}
          >
            <Fontisto color={Colors.white} size={28} name={"bell"} />
          </TouchableOpacity>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity onPress={pickImage} activeOpacity={0.7}>
              <Image
                style={{
                  width: RFPercentage(12),
                  height: RFPercentage(12),
                  borderRadius: RFPercentage(7),
                }}
                source={selectedImage ? selectedImage : icons.baseProfile}
              />
            </TouchableOpacity>
            <Text
              style={{
                marginTop: RFPercentage(1.5),
                color: Colors.white,
                fontFamily: FontFamily.medium,
                fontSize: RFPercentage(1.7),
              }}
            >
              {firstName} {surName}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* profile functions */}
      <View style={{ marginTop: RFPercentage(1) }} />
      <TitleFieldRow
        title={"Firstname"}
        placeholder={"null"}
        value={firstName}
        onChange={setFirstName}
      />
      <TitleFieldRow
        title={"Surname"}
        placeholder={"null"}
        value={surName}
        onChange={setSurName}
      />
      <TitleFieldRow
        title={"Email"}
        placeholder={"null"}
        value={email}
        onChange={setEmail}
      />

      <View style={styles.emailmain}>
        <Text
          style={{
            color: Colors.blacksuit,
            fontFamily: FontFamily.medium,
            fontSize: RFPercentage(1.7),
          }}
        >
          Description
        </Text>

        <TextInput
          style={{
            width: "100%",
            fontFamily: FontFamily.regular,
            fontSize: RFPercentage(1.5),
            textAlignVertical: "top", // Align text to the top
          }}
          onChangeText={setDescription}
          value={description}
          placeholder={"null"}
          placeholderTextColor={Colors.placeholder}
          multiline={true} // Allows multi-line input
          numberOfLines={5} // Controls the visible lines
        />
      </View>

      <TitleFieldRow
        title={"Bio"}
        placeholder={"null"}
        value={bio}
        onChange={setBio}
      />
      <TouchableOpacity style={styles.loginbutton} activeOpacity={0.7}>
        <AppButton
          title={"Save"}
          buttonColor={Colors.primary}
          loading={loading}
        />
      </TouchableOpacity>

      {/* buttons */}
      <View
        style={{
          flexDirection: "row",
          width: "90%",
          marginTop: RFPercentage(2),
          justifyContent: "space-between",
        }}
      >
        <LinearGradient
          colors={[Colors.lightgreen, Colors.primary]} // Define your two gradient colors here
          start={{ x: 0, y: 0 }} // Start point (top-left)
          end={{ x: 1, y: 1 }} // End point (bottom-right)
          style={{
            width: "48%",
            height: RFPercentage(5.7),
            backgroundColor: Colors.primary,
            borderRadius: RFPercentage(0.8),
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              navigation.navigate("LoginScreen");
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialCommunityIcons
              name="lock-reset"
              size={28}
              color={Colors.white}
            />
            <Text
              style={{
                marginLeft: RFPercentage(0.5),
                color: Colors.white,
                fontFamily: FontFamily.medium,
                fontSize: RFPercentage(1.8),
              }}
            >
              Reset Password
            </Text>
          </TouchableOpacity>
        </LinearGradient>

        <LinearGradient
          colors={[Colors.lightgreen, Colors.primary]} // Define your two gradient colors here
          start={{ x: 0, y: 0 }} // Start point (top-left)
          end={{ x: 1, y: 1 }} // End point (bottom-right)
          style={{
            width: "48%",
            height: RFPercentage(5.7),
            backgroundColor: Colors.primary,
            borderRadius: RFPercentage(1),
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleLogout}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialIcons name="logout" size={28} color={Colors.white} />
            <Text
              style={{
                marginLeft: RFPercentage(1),
                color: Colors.white,
                fontFamily: FontFamily.medium,
                fontSize: RFPercentage(1.8),
              }}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};
export default Profilescreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  emailmain: {
    width: "90%",
    backgroundColor: Colors.textField,
    borderRadius: RFPercentage(1),
    color: Colors.blacky,
    padding: RFPercentage(1.5),
    marginTop: RFPercentage(1),
  },
  loginbutton: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: RFPercentage(1.5),
  },
});
