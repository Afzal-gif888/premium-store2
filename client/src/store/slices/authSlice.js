import { createSlice } from '@reduxjs/toolkit';

// Safe localStorage access (prevents SSR crashes)
const getStorageItem = (key) => {
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            return localStorage.getItem(key);
        }
    } catch (e) {
        console.warn('localStorage not available');
    }
    return null;
};

const initialState = {
    isAuthenticated: getStorageItem('isAdminAuthenticated') === 'true',
    user: getStorageItem('adminUser') || null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            const { username, password } = action.payload;
            // STRICT CREDENTIAL CHECK
            if (username === 'chandpeera786@gmail.com' && password === 'peera143@') {
                state.isAuthenticated = true;
                state.user = username;
                localStorage.setItem('isAdminAuthenticated', 'true');
                localStorage.setItem('adminUser', username);
            } else {
                // We can throw an error or handle it in the UI component by checking state
                state.isAuthenticated = false;
                state.user = null;
            }
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            localStorage.removeItem('isAdminAuthenticated');
            localStorage.removeItem('adminUser');
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
