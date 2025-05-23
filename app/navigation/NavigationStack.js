import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import CalendarScreen from "../screens/Dietitian/CalendarScreen";
import CreateEventScreen from "../screens/Dietitian/CreateEventScreen";
import CalendarEvent from "../screens/Dietitian/CalendarEvent";
import ExistingContactsScreen from "../screens/Dietitian/ExistingContactsScreen";
import ManageEvent from "../screens/Dietitian/ManageEvent";

import BottomTab from "./BottomTab";

const Stack = createNativeStackNavigator();

export default function NavigationStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerMode: "false" }}
      initialRouteName={"CalendarScreen"}
    >
      {/* login */}
      <Stack.Screen
        options={{ headerShown: false }}
        name="SplashScreen"
        component={SplashScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="LoginScreen"
        component={LoginScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="CalendarScreen"
        component={CalendarScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="CreateEventScreen"
        component={CreateEventScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="CalendarEvent"
        component={CalendarEvent}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="ExistingContactsScreen"
        component={ExistingContactsScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="ManageEvent"
        component={ManageEvent}
      />

      <Stack.Screen
        options={{ headerShown: false }}
        name="BottomTab"
        component={BottomTab}
      />
    </Stack.Navigator>
  );
}
