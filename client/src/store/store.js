import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import stockReducer from './slices/stockSlice';
import announcementReducer from './slices/announcementSlice';
import paymentReducer from './slices/paymentSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        stock: stockReducer,
        announcements: announcementReducer,
        payments: paymentReducer,
    },
});

export default store;
