import React, { useState, useEffect } from "react";
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Formik } from "formik";
import * as yup from "yup";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase"; // Import auth and db from firebase.js

//Components
import Screen from "../components/Screen";
import DoubleField from "../components/DoubleField";

//config
import icons from "../config/icons";
import Colors from "../config/Colors";
import { FontFamily } from "../config/font";

const SignupScreen = (props) => {
  const [eyeIcon, setEyeIcon] = useState(false);
  const [eyeIcon2, setEyeIcon2] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [city, onChangeCity] = useState("");
  const [state, onChangeState] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  // Validation schema for email and password
  const validationSchema = yup.object().shape({
    email: yup.string().required().email().label("Email"),
    fullName: yup.string().required().label("Full Name"),
    phoneNumber: yup.string().required().label("Mobile number"),
    password: yup
      .string()
      .required()
      .min(8)
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/[a-z]/, "Must contain at least one lowercase letter")
      .matches(/[0-9]/, "Must contain at least one digit")
      .matches(/[!@#$%^&*(),.?":{}|<>]/, "Must contain at least one symbol")
      .label("Password"),
    confirmPassword: yup
      .string()
      .required("Confirm password is required")
      .oneOf([yup.ref("password"), null], "Passwords must match"),
  });

  // Handle signup function
  const handleSignup = async (values) => {
    setLoading(true);

    const { email, password, fullName, phoneNumber } = values;

    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Get user ID
      const userId = userCredential.user.uid;

      // Save additional user information in Firestore
      await setDoc(doc(db, "users", userId), {
        fullName,
        email,
        phoneNumber,
        city,
        state,
        createdAt: new Date().toISOString(),
      });

      setLoading(false);

      // Navigate to the LoginScreen on success
      Alert.alert("Signup Success");
      props.navigation.navigate("LoginScreen");
    } catch (error) {
      setLoading(false);

      // Display error
      Alert.alert("Signup Failed", error.message || "Something went wrong!");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100} // Adjust based on your header height
    >
      {/* <Screen style={styles.screen}> */}
      <View style={styles.logocontainer}>
        <Text
          style={{
            fontFamily: FontFamily.medium,
            fontSize: RFPercentage(3.5),
            color: Colors.white,
          }}
        >
          RawE
        </Text>
      </View>

      {/* //email input */}
      <View style={{ marginTop: RFPercentage(5.5) }} />
      <Formik
        initialValues={{
          email: "",
          password: "",
          fullName: "",
          phoneNumber: "",
          city: "",
          state: "",
        }}
        onSubmit={handleSignup}
        validationSchema={validationSchema}
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
            <View style={styles.emailmain}>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("fullName")}
                onBlur={() => setFieldTouched("fullName")}
                placeholder="Full Name"
                placeholderTextColor={Colors.placeholder}
              />
            </View>
            {touched.fullName && errors.fullName && (
              <View style={{ width: "90%" }}>
                <Text style={styles.error}>{errors.fullName}</Text>
              </View>
            )}
            <View style={{ marginTop: RFPercentage(0.5) }} />

            <View style={styles.inputmaincontainer}>
              <View style={styles.emailmain}>
                <TextInput
                  style={styles.input}
                  keyboardType="email-address"
                  onChangeText={handleChange("email")}
                  onBlur={() => setFieldTouched("email")}
                  autoCapitalize="none"
                  // value={text}
                  placeholder="Email Address"
                  placeholderTextColor={Colors.placeholder}
                />
              </View>
              {touched.email && errors.email && (
                <View style={{ width: "90%" }}>
                  <Text style={styles.error}>{errors.email}</Text>
                </View>
              )}
              <View style={{ marginTop: RFPercentage(1.5) }} />

              {/* password */}
              <View style={styles.emailmain}>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange("password")}
                  onBlur={() => setFieldTouched("password")}
                  // value={Password}
                  placeholder="Password"
                  placeholderTextColor={Colors.placeholder}
                  secureTextEntry={true && !eyeIcon}
                />

                <TouchableOpacity
                  onPress={() => setEyeIcon(!eyeIcon)}
                  activeOpacity={0.7}
                  style={styles.eyeicon}
                >
                  <MaterialCommunityIcons
                    color={Colors.placeholder}
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

              {/* confirm password */}
              <View style={{ marginTop: RFPercentage(1.5) }} />
              <View style={styles.emailmain}>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={() => setFieldTouched("confirmPassword")}
                  placeholder="Confirm Password"
                  placeholderTextColor={Colors.placeholder}
                  secureTextEntry={true && !eyeIcon2}
                />

                <TouchableOpacity
                  onPress={() => setEyeIcon2(!eyeIcon2)}
                  activeOpacity={0.7}
                  style={styles.eyeicon}
                >
                  <MaterialCommunityIcons
                    color={Colors.placeholder}
                    style={{ right: RFPercentage(1) }}
                    size={RFPercentage(3)}
                    name={eyeIcon2 ? "eye-outline" : "eye-off-outline"}
                  />
                </TouchableOpacity>
              </View>
              {touched.confirmPassword && errors.confirmPassword && (
                <View style={{ width: "90%" }}>
                  <Text style={styles.error}>{errors.confirmPassword}</Text>
                </View>
              )}

              {/* phone no */}
              <View style={{ marginTop: RFPercentage(1.5) }} />
              <View style={styles.emailmain}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  onChangeText={handleChange("phoneNumber")}
                  onBlur={() => setFieldTouched("phoneNumber")}
                  autoCapitalize="none"
                  placeholder="Mobile number"
                  placeholderTextColor={Colors.placeholder}
                />
              </View>
              {touched.email && errors.email && (
                <View style={{ width: "90%" }}>
                  <Text style={styles.error}>{errors.email}</Text>
                </View>
              )}
              <View style={{ marginTop: RFPercentage(0.5) }} />

              {/* city state */}
              <DoubleField
                ftitle="City"
                ltitle="State"
                fvalue={city}
                lvalue={state}
                onChangeF={onChangeCity}
                onChangeL={onChangeState}
              />
            </View>

            <TouchableOpacity
              style={styles.loginbutton}
              activeOpacity={0.7}
              onPress={handleSubmit} // Submit form
            >
              <View
                style={{
                  width: "90%",
                  height: RFPercentage(6.5),
                  borderRadius: RFPercentage(1),
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: RFPercentage(2),
                  backgroundColor: Colors.primary,
                }}
              >
                {loading ? (
                  <ActivityIndicator color={Colors.white} size={22} />
                ) : (
                  <Text style={styles.buttontext}>SignUp</Text>
                )}
              </View>
            </TouchableOpacity>
          </>
        )}
      </Formik>

      {/* Signup */}
      <View
        style={{
          flexDirection: "row",
          marginTop: RFPercentage(2),
        }}
      >
        <Text
          style={{
            color: Colors.white,
            fontFamily: FontFamily.regular,
            fontSize: RFPercentage(1.5),
          }}
        >
          If have an account ?
        </Text>
        <TouchableOpacity
          onPress={() => {
            props.navigation.goBack();
          }}
          activeOpacity={0.7}
        >
          <Text
            style={{
              color: Colors.primary,
              fontFamily: FontFamily.semiBold,
              fontSize: RFPercentage(1.5),
            }}
          >
            Login
          </Text>
        </TouchableOpacity>
      </View>
      {/* </Screen> */}
    </KeyboardAvoidingView>
  );
};
export default SignupScreen;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.blacky,
  },
  logocontainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: RFPercentage(13),
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
    width: "90%",
    height: RFPercentage(6.5),
    backgroundColor: Colors.ligthBlack,
    color: Colors.blacky,
    paddingLeft: RFPercentage(3),
    borderRadius: RFPercentage(1),
    justifyContent: "center",
  },
  input: { fontFamily: FontFamily.regular, color: Colors.lightWhite },

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
    marginTop: RFPercentage(2),
  },
  appfbgcontainer: {
    width: "90%",
    paddingVertical: RFPercentage(1.5),
    marginVertical: RFPercentage(1),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: RFPercentage(0.1),
    borderColor: Colors.lightWhite,
    borderRadius: RFPercentage(1),
    flexDirection: "row",
  },
  socialmain: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: RFPercentage(3),
  },
  fbglogo: {
    width: RFPercentage(3),
    height: RFPercentage(3),
    marginRight: RFPercentage(1.5),
  },

  forgotPasswordButton: {
    marginTop: RFPercentage(1),
    position: "absolute",
    right: RFPercentage(2),
  },
  forgotPasswordText: {
    color: Colors.primary,
    fontFamily: FontFamily.regular,
    fontSize: RFPercentage(1.4),
  },
  buttontext: {
    color: Colors.white,
    fontSize: RFPercentage(1.8),
    fontFamily: FontFamily.semiBold,
  },
});
