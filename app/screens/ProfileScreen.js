import React, { useState } from "react";
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
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
//config
import Colors from "../config/Colors";
import { FontFamily } from "../config/font";
import icons from "../config/icons";

// component
import TitleFieldRow from "../components/TitleFieldRow";
import AppButton from "../components/AppButton";

const Profilescreen = (props) => {
  const [firstName, setFirstName] = useState("");
  const [surName, setSurName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const [selectedImage, setSelectedImage] = useState(null);
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
          height: Platform.OS == "ios" ? RFPercentage(28) : RFPercentage(20),
          alignItems: "center",
          justifyContent: "center",
          borderBottomLeftRadius: RFPercentage(5),
          borderBottomRightRadius: RFPercentage(5),
        }}
      >
        <View
          style={{
            width: "90%",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            bottom: RFPercentage(3),
          }}
        >
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
                source={
                  selectedImage
                    ? { uri: selectedImage } // If an image is picked, use it
                    : icons.profile1 // If null, use the local default image
                }
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
              Armon Nilson
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* profile functions */}
      <View style={{ marginTop: RFPercentage(1) }} />
      <TitleFieldRow
        title={"Firstname"}
        placeholder={"Armon"}
        value={firstName}
        onChange={setFirstName}
      />
      <TitleFieldRow
        title={"Surname"}
        placeholder={"Nilson"}
        value={surName}
        onChange={setSurName}
      />
      <TitleFieldRow
        title={"Email"}
        placeholder={"info@nutriqapp.com"}
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
          placeholder={
            "Expert in crafting balanced meals tailored to dietary needs, ensuring taste and health go hand in hand."
          }
          placeholderTextColor={Colors.placeholder}
          multiline={true} // Allows multi-line input
          numberOfLines={5} // Controls the visible lines
        />
      </View>

      <TitleFieldRow
        title={"Bio"}
        placeholder={"Passionate about delicious meals"}
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
              props.navigation.navigate("LoginScreen");
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
            onPress={() => {
              props.navigation.navigate("LoginScreen");
            }}
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
