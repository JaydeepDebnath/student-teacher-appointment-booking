import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

const initialState = {
   status:false,
   studentData: null,
   isAuthenticated: false,
   insights: null,
   error:null,
}

const API_BASE_URL = 'http://localhost:8000/api/student';

export const registerStudent = createAsyncThunk(
    'auth/student/register',
    async(credentials,thunkAPI) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/register`,credentials)
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
);

export const loginStudent = createAsyncThunk(
    'auth/student/login',
    async (credentials, thunkAPI) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, credentials);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const studentProfile = createAsyncThunk(
    'auth/student/profile',
    async (credentials, thunkAPI) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/profile`, credentials);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const changePassword = createAsyncThunk(
    'student/change-password',
    async (credentials, thunkAPI) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/change-password`, credentials);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const updateAccount = createAsyncThunk(
    'student/update',
    async (credentials, thunkAPI) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/update`, credentials);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getAppointment = createAsyncThunk(
    'student/get-appoinment',
    async (credentials, thunkAPI) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/get-appoinment`, credentials);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

const studentAuthSlice = createSlice({
  name:"studentAuth",
  initialState,
  reducers:{
    logout :( state) => {
    state.status = false;
    state.isAuthenticated = false;
    state.studentData = null;
   },
  },
  extraReducers : (builder) => {
    builder
    .addCase(loginStudent.fulfilled,(state,action) => {
      state.isAuthenticated = true;
      state.user = action.payload.studentData;
      state.status = 'succeeded'
    })
    .addCase(registerStudent.fulfilled,(state,action) => {
      state.isAuthenticated = true;
      state.user = action.payload.studentData;
      state.status = 'succeeded'
    })
    .addCase(studentProfile.fulfilled,(state,action) => {
        state.isAuthenticated = true;
        state.user = action.payload.studentData;
        state.status = 'succeeded'
      })
    .addCase(changePassword.fulfilled,(state,action) => {
      state.isAuthenticated = true;
      state.user = action.payload.studentData;
      state.status = 'succeeded'
    })
    .addCase(updateAccount.fulfilled,(state,action) => {
      state.isAuthenticated = true;
      state.user = action.payload.studentData;
    })
    .addCase(getAppointment.fulfilled,(state,action) => {
      state.isAuthenticated = true;
      state.user = action.payload.studentData;
    })
  } 
})

export const {logout } = studentAuthSlice.actions;

export default studentAuthSlice.reducer;