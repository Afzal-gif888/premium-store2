import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_ENDPOINTS } from 'config/api';

const API_URL = API_ENDPOINTS.PAYMENTS;

export const fetchPayments = createAsyncThunk('payments/fetchPayments', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch payments');
    }
});

export const addPayment = createAsyncThunk('payments/addPayment', async (paymentData, { rejectWithValue }) => {
    try {
        const response = await axios.post(API_URL, paymentData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to add payment');
    }
});

const initialState = {
    history: [],
    status: 'idle',
    error: null
};

const paymentSlice = createSlice({
    name: 'payments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPayments.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPayments.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.history = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchPayments.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(addPayment.fulfilled, (state, action) => {
                if (action.payload && typeof action.payload === 'object' && !Array.isArray(action.payload)) {
                    state.history.unshift(action.payload);
                }
            });
    },
});

export default paymentSlice.reducer;
