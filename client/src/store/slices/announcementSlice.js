import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_ENDPOINTS } from 'config/api';

const API_URL = API_ENDPOINTS.ANNOUNCEMENTS;

export const fetchAnnouncements = createAsyncThunk('announcements/fetchAnnouncements', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}?t=${Date.now()}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch announcements:', error.message);
        return rejectWithValue(error.response?.data || 'Failed to load announcements');
    }
});

export const addAnnouncement = createAsyncThunk('announcements/addAnnouncement', async (announcement, { rejectWithValue }) => {
    try {
        const response = await axios.post(API_URL, announcement);
        return response.data;
    } catch (error) {
        console.error('Failed to add announcement:', error.message);
        return rejectWithValue(error.response?.data || 'Failed to add announcement');
    }
});

export const deleteAnnouncement = createAsyncThunk('announcements/deleteAnnouncement', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
        return id;
    } catch (error) {
        console.error('Failed to delete announcement:', error.message);
        return rejectWithValue(error.response?.data || 'Failed to delete announcement');
    }
});

const initialState = {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
};

const announcementSlice = createSlice({
    name: 'announcements',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAnnouncements.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAnnouncements.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchAnnouncements.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (typeof action.payload === 'string' ? action.payload : action.payload?.message) || action.error.message;
            })
            .addCase(addAnnouncement.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })
            .addCase(addAnnouncement.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            })
            .addCase(deleteAnnouncement.fulfilled, (state, action) => {
                state.items = state.items.filter(a => (a._id || a.id) !== action.payload);
            })
            .addCase(deleteAnnouncement.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            });
    },
});

export default announcementSlice.reducer;
