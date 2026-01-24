import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminRoute from "./routes/AdminRoute";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// import NotFound from "pages/NotFound"; // Lazy load this too

// Lazy loading pages
const Homepage = lazy(() => import("homepage"));
const ProductDetails = lazy(() => import("product-details"));
const NotFound = lazy(() => import("pages/NotFound"));

// Admin Pages
const LoginPage = lazy(() => import("pages/admin/LoginPage"));
const SignupPage = lazy(() => import("pages/admin/SignupPage"));
const AdminLayout = lazy(() => import("pages/admin/AdminLayout"));
const StockPage = lazy(() => import("pages/admin/StockPage"));
const AnnouncementsPage = lazy(() => import("pages/admin/AnnouncementsPage"));
const BestsellersPage = lazy(() => import("pages/admin/BestsellersPage"));
const PaymentsPage = lazy(() => import("pages/admin/PaymentsPage"));

// Note: admin auth is handled via Firebase Auth and AuthContext.
// We use AdminRoute (which waits for authReady) to protect admin pages.

const Routes = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ErrorBoundary>
        <ScrollToTop />
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        }>
          <RouterRoutes>
            {/* Customer Routes */}
            <Route path="/" element={<Homepage />} />
            <Route path="/product/:id" element={<ProductDetails />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin/signup" element={<SignupPage />} />

            <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route path="/admin/stock" element={<StockPage />} />
              <Route path="/admin/announcements" element={<AnnouncementsPage />} />
              <Route path="/admin/bestsellers" element={<BestsellersPage />} />
              <Route path="/admin/payments" element={<PaymentsPage />} />
              {/* Fallback for admin sub-paths */}
              <Route path="/admin/*" element={<Navigate to="/admin/stock" replace />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
