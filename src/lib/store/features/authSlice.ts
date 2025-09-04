import { asyncThunkCreator, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createClient } from "@/utils/supabase/client";
import { RootState } from "../store";
import { string } from "zod";
interface User {
    id: string;
  fullname: string;
  email: string;
  role: string;
}
interface AuthState {
  // loading: boolean;
  user: any | null;
  // error: string | null;
}
const initialState: AuthState = {
  // loading: false,
  user: null,
  // error: null,
};



export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser : (state, action)=> {
      console.log("action.payload in setUser", action.payload)
      state.user = action.payload
      
    },
    clearUser: (state)=> {
      state.user = null
    }
  },
 
});

// export const selectLoading = (state: RootState) => state.auth.loading;
// export const selectError = (state: RootState) => state.auth.error;
// export const selectUser = (state: RootState) => state.auth.user;
export const {setUser, clearUser} = authSlice.actions

export default authSlice.reducer;
