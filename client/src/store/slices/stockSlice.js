import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Firestore (client SDK)
import { db } from 'firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export const fetchProducts = createAsyncThunk('stock/fetchProducts', async (_, { rejectWithValue }) => {
    try {
        const q = collection(db, 'products');
        const snapshot = await getDocs(q);
        const products = snapshot.docs.map(docSnap => {
            const data = docSnap.data();
            return {
                ...data,
                _id: docSnap.id,
                id: docSnap.id,
                createdAt: data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : data.createdAt
            };
        });
        return products;
    } catch (error) {
        console.error('Failed to fetch products:', error.message);
        return rejectWithValue(error.message || 'Failed to load products');
    }
});

export const addProduct = createAsyncThunk('stock/addProduct', async (product, { rejectWithValue }) => {
    try {
        const payload = { ...product, createdAt: new Date() };
        const docRef = await addDoc(collection(db, 'products'), payload);
        return { ...payload, _id: docRef.id, id: docRef.id };
    } catch (error) {
        console.error('Failed to add product:', error.message);
        return rejectWithValue(error.message || 'Failed to add product');
    }
});

export const updateProduct = createAsyncThunk('stock/updateProduct', async ({ id, data }, { rejectWithValue }) => {
    try {
        const docRef = doc(db, 'products', id);
        await updateDoc(docRef, data);
        // Return updated object (merge id)
        return { ...data, _id: id, id };
    } catch (error) {
        console.error('Failed to update product:', error.message);
        return rejectWithValue(error.message || 'Failed to update product');
    }
});

export const deleteProduct = createAsyncThunk('stock/deleteProduct', async (id, { rejectWithValue }) => {
    try {
        const docRef = doc(db, 'products', id);
        await deleteDoc(docRef);
        return id;
    } catch (error) {
        console.error('Failed to delete product:', error.message);
        return rejectWithValue(error.message || 'Failed to delete product');
    }
});

export const toggleBestseller = createAsyncThunk('stock/toggleBestseller', async ({ id, isBestseller }, { rejectWithValue }) => {
    try {
        const docRef = doc(db, 'products', id);
        await updateDoc(docRef, { isBestseller });
        return { _id: id, id, isBestseller };
    } catch (error) {
        console.error('Failed to toggle bestseller:', error.message);
        return rejectWithValue(error.message || 'Failed to toggle bestseller');
    }
});

const initialState = {
    products: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
};

const stockSlice = createSlice({
    name: 'stock',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.products = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (typeof action.payload === 'string' ? action.payload : action.payload?.message) || action.error.message;
            })
            .addCase(addProduct.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.products.push(action.payload);
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            })
            .addCase(updateProduct.pending, (state) => {
                state.status = 'updating';
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const updated = action.payload;
                const index = state.products.findIndex(p => (p._id || p.id) === (updated._id || updated.id));
                if (index !== -1) {
                    state.products[index] = updated;
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            })
            .addCase(deleteProduct.pending, (state, action) => {
                const id = action.meta.arg;
                state.products = state.products.filter(p => (p._id || p.id) !== id);
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                // Already removed in pending, but we ensure it matches the final payload if any
                state.products = state.products.filter(p => (p._id || p.id) !== action.payload);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
                // Re-fetch everything to restore consistency after a failed delete
                // (Alternatively, we could have saved the deleted item to restore it)
            })
            .addCase(toggleBestseller.pending, (state, action) => {
                state.status = 'updating';
                // Optimistic Update: Toggle immediately in UI
                const { id } = action.meta.arg;
                const index = state.products.findIndex(p => (p._id || p.id) === id);
                if (index !== -1) {
                    state.products[index].isBestseller = !state.products[index].isBestseller;
                }
            })
            .addCase(toggleBestseller.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const updated = action.payload;
                const index = state.products.findIndex(p => (p._id || p.id) === (updated._id || updated.id));
                if (index !== -1) {
                    state.products[index] = updated;
                }
            })
            .addCase(toggleBestseller.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
                // Revert Optimistic Update on failure
                const { id } = action.meta.arg;
                const index = state.products.findIndex(p => (p._id || p.id) === id);
                if (index !== -1) {
                    state.products[index].isBestseller = !state.products[index].isBestseller;
                }
            });
    },
});

export default stockSlice.reducer;
