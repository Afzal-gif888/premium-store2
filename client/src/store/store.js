import { configureStore } from '@reduxjs/toolkit';
import stockReducer from './slices/stockSlice';
import announcementReducer from './slices/announcementSlice';
import paymentReducer from './slices/paymentSlice';

const store = configureStore({
    reducer: {
        stock: stockReducer,
        announcements: announcementReducer,
        payments: paymentReducer,
    },
});

export default store;
