import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "store/slices/stockSlice";
import { fetchAnnouncements } from "store/slices/announcementSlice";
import Routes from "./Routes";

const isProduction = window.location.hostname.includes('vercel.app') || window.location.hostname.includes('netlify.app');
const isApiConfigured = !!import.meta.env.VITE_API_URL;

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initial fetch for the entire app state
    dispatch(fetchProducts());
    dispatch(fetchAnnouncements());
  }, [dispatch]);

  return (
    <>
      {isProduction && !isApiConfigured && (
        <div className="bg-red-600 text-white text-center py-3 px-4 text-sm font-bold sticky top-0 z-[9999] shadow-xl animate-pulse">
          ⚠️ CONFIGURATION ERROR: VITE_API_URL is not set in Vercel settings.
          API calls (Uploads, Payments) will FAIL. Please add your Railway URL to Vercel Environment Variables.
        </div>
      )}
      <Routes />
    </>
  );
}

export default App;
