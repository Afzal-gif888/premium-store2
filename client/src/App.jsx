import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "store/slices/stockSlice";
import { fetchAnnouncements } from "store/slices/announcementSlice";
import Routes from "./Routes";

const isProduction = window.location.hostname.includes('vercel.app') || window.location.hostname.includes('netlify.app');

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initial fetch for the entire app state
    dispatch(fetchProducts());
    dispatch(fetchAnnouncements());
  }, [dispatch]);

  return (
    <>
      {/* Frontend-only: API backend removed. Ensure Firestore + Cloudinary env vars are set in Netlify. */}
      <Routes />
    </>
  );
}

export default App;
