import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

//navigation
import NavigationStack from "./app/navigation/NavigationStack";

// redux
import store from "./app/redux/store";
import { Provider } from "react-redux";

//component
import AppLoading from "./app/components/AppLoading";

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,

    Poppins_500Medium,

    Poppins_600SemiBold,

    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <NavigationStack />
        </NavigationContainer>
      </Provider>
    );
  }
}
