import { configureStore } from '@reduxjs/toolkit';
import studentAuthSlice from './studentAuthSlice';
import teacherAuthSlice from './teacherAuthSlice';
import appointmentAuthSlice from './appointmentAuthSlice';

const store = configureStore({
    reducer : {
        studentAuth: studentAuthSlice,
        teacherAuth : teacherAuthSlice,
        appointmentAuth:appointmentAuthSlice,
    }
});

export default store;