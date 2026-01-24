// Server-side Firebase Admin entry point.
// This file re-exports the existing admin/db/auth/storage objects from config/firebase.js
// so other server modules can import from a predictable path: server/firebase/admin.js

export { admin, db, auth, storage } from '../config/firebase.js';
