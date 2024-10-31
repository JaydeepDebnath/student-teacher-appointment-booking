import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

const initialState = {
  appointments: [],
  loading: false,
  error: null,
}

const API_BASE_URL = 'http://localhost:8000/appointment';

export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const bookAppointment = createAsyncThunk(
    'appointment/book',
    async(appointmentData,thunkAPI) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/book`,appointmentData)
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
);
export const cancelAppointment = createAsyncThunk(
    'appointment/cancel',
    async(id,thunkAPI) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/cancel/${id}`)
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
);
export const rescheduleAppointment = createAsyncThunk(
    'appointment/reschedule',
    async({ id, appointmentData },thunkAPI) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/reschedule/${id}`,appointmentData)
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
);
export const reminderAppointment = createAsyncThunk(
    'appointment/reminder',
    async({ id, appointmentData },thunkAPI) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/reminder/${id}`,appointmentData)
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
);


const appointmentAuthSlice = createSlice({
  name:"appointmentAuth",
  initialState,
  reducers: {},
  extraReducers : (builder) => {
  builder
    .addCase(fetchAppointments.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
        state.error = null;
    })
    .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'An error occurred';;
    })
    .addCase(bookAppointment.fulfilled,(state,action) => {
        state.loading = false;
        state.appointments.push(action.payload);
        state.error = null;
    })
    .addCase(cancelAppointment.fulfilled,(state,action) => {
      state.loading = false;
      const index = state.appointments.findIndex(appointment => appointment._id === action.payload._id);
      if (index !== -1) {
          state.appointments.splice(index,1)
        }
        state.error = null;
    })
    .addCase(rescheduleAppointment.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.appointments.findIndex(appointment => appointment._id === action.payload._id);
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
      state.error = null;
    })
    .addCase(reminderAppointment.fulfilled,(state,action) => {
      state.loading = false;
      state.error = null;
    })
    .addCase(reminderAppointment.rejected, (state,action) => {
      state.status = 'failed';
      state.error = action.payload;
    })
    .addMatcher(
      action => [fetchAppointments.pending,bookAppointment.pending,
        rescheduleAppointment.pending,cancelAppointment.pending,
        reminderAppointment.pending]
        .includes(action.type),
        (state) => {
          state.loading = true;
        }
    );
  }, 
});

export const selectAppointments = state => state.appointmentAuth.appointments;
export const selectLoading = state => state.appointmentAuth.loading;

export default appointmentAuthSlice.reducer;