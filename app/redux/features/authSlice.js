import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "../../apis/apiClient"; // Adjust path as needed

// Async thunk to load tokens from AsyncStorage
export const loadTokens = createAsyncThunk("auth/loadTokens", async () => {
  const accessToken = await AsyncStorage.getItem("accessToken");
  const refreshToken = await AsyncStorage.getItem("refreshToken");
  return { accessToken, refreshToken };
});

// Async thunk for login
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/api/auth/login", {
        email,
        password,
      });
      const { accessToken, refreshToken } = response.data.data;

      // Store tokens in AsyncStorage
      await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem("refreshToken", refreshToken);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Async thunk to clear tokens
export const clearTokensAsync = createAsyncThunk(
  "auth/clearTokensAsync",
  async () => {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: null,
    refreshToken: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Load tokens
      .addCase(loadTokens.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadTokens.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(loadTokens.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Handle login
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Handle token clearing
      .addCase(clearTokensAsync.fulfilled, (state) => {
        state.accessToken = null;
        state.refreshToken = null;
        state.status = "idle";
      });
  },
});

export const { clearTokens } = authSlice.actions;

export const selectAccessToken = (state) => state.auth.accessToken;

export default authSlice.reducer;
