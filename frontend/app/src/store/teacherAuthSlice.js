import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

const initialState = {
   status:false,
   teacherData: null,
   isAuthenticated: false,
   insights: null,
   error:null,
}

const API_BASE_URL = 'http://localhost:8000/api/teacher';

export const registerTeacher = createAsyncThunk(
    'auth/teacher/register',
    async(credentials,thunkAPI) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/register`,credentials)
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
);

export const loginTeacher = createAsyncThunk(
    'auth/teacher/login',
    async (credentials, thunkAPI) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, credentials);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const changePassword = createAsyncThunk(
    'teacher/change-password',
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
    'teacher/update',
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
    'teacher/get-appoinment',
    async (credentials, thunkAPI) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/get-appoinment`, credentials);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

const teacherAuthSlice = createSlice({
  name:"teacherAuth",
  initialState,
  reducers:{
    logout :( state) => {
    state.status = false;
    state.isAuthenticated = false;
    state.teacherData = null;
   },
  },
  extraReducers : (builder) => {
    builder
    .addCase(loginTeacher.fulfilled,(state,action) => {
      state.isAuthenticated = true;
      state.user = action.payload.teacherData;
      state.status = 'succeeded'
    })
    .addCase(registerTeacher.fulfilled,(state,action) => {
      state.isAuthenticated = true;
      state.user = action.payload.teacherData;
      state.status = 'succeeded'
    })
    .addCase(changePassword.fulfilled,(state,action) => {
      state.isAuthenticated = true;
      state.user = action.payload.teacherData;
      state.status = 'succeeded'
    })
    .addCase(updateAccount.fulfilled,(state,action) => {
      state.isAuthenticated = true;
      state.user = action.payload.teacherData;
    })
    .addCase(getAppointment.fulfilled,(state,action) => {
      state.isAuthenticated = true;
      state.user = action.payload.teacherData;
    })
  } 
})

export const {logout } = teacherAuthSlice.actions;

export default teacherAuthSlice.reducer;