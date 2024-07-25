import { configureStore } from '@reduxjs/toolkit';
import studentAuthSlice from './studentAuthSlice';
import teacherAuthSlice from './teacherAuthSlice';

const store = configureStore({
    reducer : {
        studentAuth: studentAuthSlice,
        teacherAuth : teacherAuthSlice,
    }
});

export default store;