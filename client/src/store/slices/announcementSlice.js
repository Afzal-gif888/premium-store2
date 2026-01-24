import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from 'firebase';
import { collection, getDocs, addDoc, deleteDoc, writeBatch, query, orderBy, doc } from 'firebase/firestore';

const COLLECTION = 'announcements';

export const fetchAnnouncements = createAsyncThunk('announcements/fetchAnnouncements', async (_, { rejectWithValue }) => {
    try {
        const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map(docSnap => {
            const data = docSnap.data();
            return {
                ...data,
                _id: docSnap.id,
                id: docSnap.id,
                createdAt: data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : data.createdAt
            };
        });
        return items;
    } catch (error) {
        console.error('Failed to fetch announcements:', error.message);
        return rejectWithValue(error.message || 'Failed to load announcements');
    }
});

export const addAnnouncement = createAsyncThunk('announcements/addAnnouncement', async (announcement, { rejectWithValue }) => {
    try {
        // Clear existing announcements first (to mimic server behaviour)
        const snapshot = await getDocs(collection(db, COLLECTION));
        if (!snapshot.empty) {
            const batch = writeBatch(db);
            snapshot.docs.forEach(d => batch.delete(d.ref));
            await batch.commit();
        }

        const payload = { ...announcement, createdAt: new Date(), active: true };
        const docRef = await addDoc(collection(db, COLLECTION), payload);
        return { ...payload, _id: docRef.id, id: docRef.id };
    } catch (error) {
        console.error('Failed to add announcement:', error.message);
        return rejectWithValue(error.message || 'Failed to add announcement');
    }
});

export const deleteAnnouncement = createAsyncThunk('announcements/deleteAnnouncement', async (id, { rejectWithValue }) => {
    try {
        await deleteDoc(doc(db, COLLECTION, id));
        return id;
    } catch (error) {
        console.error('Failed to delete announcement:', error.message);
        return rejectWithValue(error.message || 'Failed to delete announcement');
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
