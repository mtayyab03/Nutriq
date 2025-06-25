import React, { useState, useEffect } from "react";
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Formik } from "formik";
import * as yup from "yup";
import { Ionicons, Fontisto, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Components
import Screen from "../components/Screen";
import AppButton from "../components/AppButton";

// apis
import apiClient from "../apis/apiClient";

//config
import icons from "../config/icons";
import Colors from "../config/Colors";
import { FontFamily } from "../config/font";

export default function LoginScreen(props) {
  const [eyeIcon, setEyeIcon] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state

  const storeToken = async (token) => {
    try {
      await AsyncStorage.setItem("authToken", token);
      console.log("Token stored successfully!");
    } catch (error) {
      console.log("Error storing token:", error);
    }
  };

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      console.log("Attempting login with:", email, password);

      const loginRes = await apiClient.post("/login", {
        username: email,
        password,
      });
      console.log("API Response:", loginRes.data);

      if (!loginRes.data.token) {
        Alert.alert("Login Failed", "Invalid response from server.");
        return;
      }

      await storeToken(loginRes.data.token);

      const profileRes = await apiClient.get("/users/profile");
      const { role } = profileRes.data;
      console.log("Profile data:", profileRes.data);

      if (role === "CLIENT") {
        props.navigation.navigate("BottomTab", { screen: "HomeScreen" });
      } else if (role === "BASIC_PROF") {
        props.navigation.navigate("CalendarEvent");
      } else {
        Alert.alert("Login", "Your account role is not recognized.");
      }
    } catch (error) {
      console.log("Login error:", error?.response?.data || error.message);
      Alert.alert(
        "Login Failed",
        error?.response?.data?.message ||
          "Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.logocontainer}>
        <Image
          style={{ width: RFPercentage(15.2), height: RFPercentage(12) }}
          source={icons.nutriqwhite}
        />
      </View>

      {/* login text */}
      <View style={{ marginTop: RFPercentage(7) }} />

      {/* //email input */}
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={handleLogin}
        // validationSchema={validationSchema}
      >
        {({
          handleChange,
          handleSubmit,
          errors,
          setFieldTouched,
          touched,
          values,
        }) => (
          <>
            <View style={styles.inputmaincontainer}>
              <View style={styles.emailmain}>
                <Ionicons
                  color={Colors.blacky}
                  style={{ marginRight: RFPercentage(2) }}
                  size={RFPercentage(3)}
                  name={"mail"}
                />
                <TextInput
                  style={styles.input}
                  keyboardType="email-address"
                  onChangeText={handleChange("email")}
                  onBlur={() => setFieldTouched("email")}
                  autoCapitalize="none"
                  // value={text}
                  placeholder="Email Address"
                  placeholderTextColor={Colors.lightBlack}
                />
              </View>
              {touched.email && errors.email && (
                <View style={{ width: "90%" }}>
                  <Text style={styles.error}>{errors.email}</Text>
                </View>
              )}
              <View style={{ marginTop: RFPercentage(2) }} />
              <View style={styles.emailmain}>
                <Fontisto
                  color={Colors.blacky}
                  style={{ marginRight: RFPercentage(2) }}
                  size={RFPercentage(3)}
                  name={"locked"}
                />
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange("password")}
                  onBlur={() => setFieldTouched("password")}
                  // value={Password}
                  placeholder="Password"
                  placeholderTextColor={Colors.lightBlack}
                  secureTextEntry={true && !eyeIcon}
                />

                <TouchableOpacity
                  onPress={() => setEyeIcon(!eyeIcon)}
                  activeOpacity={0.7}
                  style={styles.eyeicon}
                >
                  <MaterialCommunityIcons
                    color={Colors.blacksuit}
                    style={{ right: RFPercentage(1) }}
                    size={RFPercentage(3)}
                    name={eyeIcon ? "eye-outline" : "eye-off-outline"}
                  />
                </TouchableOpacity>
              </View>
              {touched.password && errors.password && (
                <View style={{ width: "90%" }}>
                  <Text style={styles.error}>{errors.password}</Text>
                </View>
              )}

              {/* forget password */}
              <View style={{ width: "100%" }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.forgotPasswordButton}
                >
                  <Text style={styles.forgotPasswordText}>
                    Forget Password ?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.loginbutton}
              activeOpacity={0.7}
              onPress={handleSubmit} // Submit form
            >
              <AppButton
                title={"Login"}
                buttonColor={Colors.primary}
                loading={loading}
              />
            </TouchableOpacity>
          </>
        )}
      </Formik>

      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          flex: 1,
          marginBottom: RFPercentage(3),
        }}
      >
        <Text
          style={{
            color: Colors.lightBlack,
            fontFamily: FontFamily.regular,
            fontSize: RFPercentage(1.5),
          }}
        >
          Don’t have an account ?
        </Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text
            style={{
              color: Colors.primary,
              fontFamily: FontFamily.semiBold,
              fontSize: RFPercentage(1.5),
            }}
          >
            Register
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  logocontainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: RFPercentage(5),
  },
  logo: {
    width: RFPercentage(15),
    height: RFPercentage(15),
  },
  inputmaincontainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: RFPercentage(1),
  },
  eyeicon: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: RFPercentage(1),
    width: RFPercentage(5),
    height: RFPercentage(5),
  },
  emailmain: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    height: RFPercentage(7),
    borderBottomWidth: RFPercentage(0.2),
    borderBottomColor: Colors.primary,
    color: Colors.blacky,
    paddingLeft: RFPercentage(1.5),
    borderRadius: RFPercentage(1),
  },
  input: {
    width: "75%",
    fontFamily: FontFamily.regular,
    color: Colors.blacky,
    fontSize: RFPercentage(2),
  },

  error: {
    color: "#FF0000",
    fontSize: RFPercentage(1.3),
    marginTop: RFPercentage(0.5),
    fontFamily: FontFamily.regular,
  },

  loginbutton: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: RFPercentage(6),
  },

  forgotPasswordButton: {
    marginTop: RFPercentage(2),
    position: "absolute",
    right: RFPercentage(2),
  },
  forgotPasswordText: {
    color: Colors.blacksuit,
    fontFamily: FontFamily.regular,
    fontSize: RFPercentage(1.8),
  },
  buttontext: {
    color: Colors.white,
    fontSize: RFPercentage(1.8),
    fontFamily: FontFamily.semiBold,
  },
});
