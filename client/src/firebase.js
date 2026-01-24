// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAXEkA9Ot9YRMAvneQMcSJxTTw_XBQeLtM",
    authDomain: "premium-store-e14ca.firebaseapp.com",
    projectId: "premium-store-e14ca",
    storageBucket: "premium-store-e14ca.appspot.com",
    messagingSenderId: "469327626100",
    appId: "1:469327626100:web:a244c35c6fd9b64397b621",
    measurementId: "G-Y9V44CEZ99"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

export { app, auth, analytics, db };
