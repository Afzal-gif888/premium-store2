import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "store/slices/stockSlice";
import { fetchAnnouncements } from "store/slices/announcementSlice";
import Routes from "./Routes";
import { AuthProvider, useAuth } from "./context/AuthContext";

const isProduction = window.location.hostname.includes('vercel.app') || window.location.hostname.includes('netlify.app');

function App() {
  const dispatch = useDispatch();

  // Move initial app data fetches into a child component that only runs
  // after Firebase auth has finished initializing. This prevents accidental
  // Firestore requests from running before auth is ready (which can trigger
  // permission/identitytoolkit errors when security rules require auth).
  const InitData = () => {
    const { authReady } = useAuth();

    useEffect(() => {
      if (!authReady) return;
      // Initial fetch for the entire app state once auth is initialized
      dispatch(fetchProducts());
      dispatch(fetchAnnouncements());
    }, [authReady, dispatch]);

    return null;
  };

  // Defensive global handlers: prevent accidental full-page navigations to
  // identitytoolkit endpoints (or other external APIs) caused by native form
  // submissions or anchors that weren't handled by React. This avoids the
  // Google 404 page when a form accidentally performs a GET on
  // https://identitytoolkit.googleapis.com/v1/accounts:signUp
  useEffect(() => {
    const onSubmitCapture = (e) => {
      try {
        const form = e.target;
        if (!(form instanceof HTMLFormElement)) return;
        const action = (form.getAttribute && form.getAttribute('action')) || form.action || '';
        if (!action) return; // no explicit action — allow React handlers to run

        // Block identitytoolkit navigations explicitly
        if (action.includes('identitytoolkit.googleapis.com')) {
          e.preventDefault();
          console.warn('Blocked navigation to identitytoolkit endpoint from form action:', action);
          return;
        }

        // Block external navigations from forms (defensive). Allow same-origin actions.
        try {
          const url = new URL(action, window.location.href);
          if (url.origin !== window.location.origin) {
            e.preventDefault();
            console.warn('Blocked external form submission to', url.href);
          }
        } catch (_) {
          // If URL parsing fails, be conservative and do not block
        }
      } catch (err) {
        // Defensive: do nothing if unexpected error occurs
        console.warn('Error in global submit guard', err);
      }
    };

    const onClickCapture = (e) => {
      try {
        const a = e.target && (e.target.closest ? e.target.closest('a') : null);
        if (!a) return;
        const href = a.getAttribute('href') || a.href || '';
        if (!href) return;
        if (href.includes('identitytoolkit.googleapis.com')) {
          e.preventDefault();
          console.warn('Blocked click navigation to identitytoolkit:', href);
        }
        // Block direct navigation to raw Google API URLs
        if (href.startsWith('https://identitytoolkit.googleapis.com')) {
          e.preventDefault();
        }
      } catch (err) {
        console.warn('Error in global click guard', err);
      }
    };

    document.addEventListener('submit', onSubmitCapture, true);
    document.addEventListener('click', onClickCapture, true);

    return () => {
      document.removeEventListener('submit', onSubmitCapture, true);
      document.removeEventListener('click', onClickCapture, true);
    };
  }, []);

  return (
    <>
      {/* Frontend-only: API backend removed. Ensure Firestore + Cloudinary env vars are set in Netlify. */}
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </>
  );
}

export default App;
