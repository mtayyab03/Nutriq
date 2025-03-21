import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer"; // Import your root reducer

const store = configureStore({
  reducer: rootReducer,
  // You can also provide middleware, devtools configuration, etc. here
});

export default store;
