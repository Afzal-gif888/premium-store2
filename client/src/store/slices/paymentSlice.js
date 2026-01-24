import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';

const COLLECTION = 'payments';

export const fetchPayments = createAsyncThunk('payments/fetchPayments', async (_, { rejectWithValue }) => {
    try {
        const q = query(collection(db, COLLECTION), orderBy('date', 'desc'));
        const snapshot = await getDocs(q);
        const payments = snapshot.docs.map(docSnap => {
            const data = docSnap.data();
            let date = data.date;
            if (date && typeof date.toMillis === 'function') {
                date = date.toMillis();
            } else if (date instanceof Date) {
                date = date.getTime();
            }
            return {
                ...data,
                _id: docSnap.id,
                id: docSnap.id,
                date
            };
        });
        return payments;
    } catch (error) {
        return rejectWithValue(error.message || 'Failed to fetch payments');
    }
});

export const addPayment = createAsyncThunk('payments/addPayment', async (paymentData, { rejectWithValue }) => {
    try {
    const now = Date.now();
    const payload = { ...paymentData, date: now };
        const docRef = await addDoc(collection(db, COLLECTION), payload);
        return { ...payload, _id: docRef.id, id: docRef.id };
    } catch (error) {
        return rejectWithValue(error.message || 'Failed to add payment');
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
