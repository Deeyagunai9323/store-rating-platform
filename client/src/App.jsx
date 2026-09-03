import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Unauthorized from "./pages/Unauthorized";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

import DashboardLayout from "./components/layout/DashboardLayout";

/* =========================================
   LANDING PAGE
========================================= */

import LandingPage from "./pages/LandingPage/LandingPage";

/* =========================================
   ADMIN PAGES
========================================= */

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminStores from "./pages/admin/AdminStores";

/* =========================================
   NORMAL USER PAGES
========================================= */

import UserStores from "./pages/user/UserStores";
import MyRatings from "./pages/user/MyRatings";
import UserProfile from "./pages/user/UserProfile";

/* =========================================
   STORE OWNER PAGES
========================================= */

import StoreOwnerDashboard from "./pages/storeOwner/StoreOwnerDashboard";
import StoreOwnerRatings from "./pages/storeOwner/StoreOwnerRatings";
import StoreOwnerProfile from "./pages/storeOwner/StoreOwnerProfile";


const App = () => {
  return (
    <BrowserRouter>

      <AuthProvider>

        <Routes>

          {/* =========================================
              PUBLIC ROUTES
          ========================================= */}

          {/* MAIN LANDING PAGE */}
          <Route
            path="/"
            element={<LandingPage />}
          />

          {/* LOGIN */}
          <Route
            path="/login"
            element={<Login />}
          />

          {/* REGISTER */}
          <Route
            path="/register"
            element={<Register />}
          />

          {/* UNAUTHORIZED */}
          <Route
            path="/unauthorized"
            element={<Unauthorized />}
          />


          {/* =========================================
              PROTECTED ROUTES
          ========================================= */}

          <Route element={<ProtectedRoute />}>


            {/* =======================================
                ADMIN PANEL
            ======================================= */}

            <Route
              element={
                <RoleRoute
                  allowedRoles={["ADMIN"]}
                />
              }
            >

              {/* ADMIN DASHBOARD */}

              <Route
                path="/admin/dashboard"
                element={
                  <DashboardLayout>
                    <AdminDashboard />
                  </DashboardLayout>
                }
              />


              {/* ADMIN STORES */}

              <Route
                path="/admin/stores"
                element={
                  <DashboardLayout>
                    <AdminStores />
                  </DashboardLayout>
                }
              />


              {/* ADMIN USERS */}

              <Route
                path="/admin/users"
                element={
                  <DashboardLayout>
                    <AdminUsers />
                  </DashboardLayout>
                }
              />

            </Route>


            {/* =======================================
                NORMAL USER PANEL
            ======================================= */}

            <Route
              element={
                <RoleRoute
                  allowedRoles={["USER"]}
                />
              }
            >

              {/* USER STORES */}

              <Route
                path="/stores"
                element={
                  <DashboardLayout>
                    <UserStores />
                  </DashboardLayout>
                }
              />


              {/* MY RATINGS */}

              <Route
                path="/my-ratings"
                element={
                  <DashboardLayout>
                    <MyRatings />
                  </DashboardLayout>
                }
              />


              {/* USER PROFILE */}

              <Route
                path="/profile"
                element={
                  <DashboardLayout>
                    <UserProfile />
                  </DashboardLayout>
                }
              />

            </Route>


            {/* =======================================
                STORE OWNER PANEL
            ======================================= */}

            <Route
              element={
                <RoleRoute
                  allowedRoles={["STORE_OWNER"]}
                />
              }
            >

              {/* STORE OWNER DASHBOARD */}

              <Route
                path="/store-owner/dashboard"
                element={
                  <DashboardLayout>
                    <StoreOwnerDashboard />
                  </DashboardLayout>
                }
              />


              {/* STORE OWNER RATINGS */}

              <Route
                path="/store-owner/ratings"
                element={
                  <DashboardLayout>
                    <StoreOwnerRatings />
                  </DashboardLayout>
                }
              />


              {/* STORE OWNER PROFILE */}

              <Route
                path="/store-owner/profile"
                element={
                  <DashboardLayout>
                    <StoreOwnerProfile />
                  </DashboardLayout>
                }
              />

            </Route>

          </Route>


          {/* =========================================
              FALLBACK
          ========================================= */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>

      </AuthProvider>

    </BrowserRouter>
  );
};


export default App;