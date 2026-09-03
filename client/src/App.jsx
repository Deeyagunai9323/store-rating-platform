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

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

import DashboardLayout from "./components/layout/DashboardLayout";

const Placeholder = ({ title }) => {
  return (
    <div>
      <div
        style={{
          marginBottom: "30px",
        }}
      >
        <p
          style={{
            color: "#5eead4",
            fontSize: "12px",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          StoreRate
        </p>

        <h1
          style={{
            margin: "8px 0",
            fontSize: "30px",
          }}
        >
          {title}
        </h1>

        <p
          style={{
            color: "#64748b",
          }}
        >
          This module will be implemented next.
        </p>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* =========================================
              PUBLIC
          ========================================= */}

          <Route
            path="/"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/unauthorized"
            element={<Unauthorized />}
          />

          {/* =========================================
              PROTECTED
          ========================================= */}

          <Route element={<ProtectedRoute />}>

            {/* =====================================
                ADMIN
            ===================================== */}

            <Route
              element={
                <RoleRoute
                  allowedRoles={["ADMIN"]}
                />
              }
            >

              {/* =================================
                  ADMIN DASHBOARD
              ================================= */}

              <Route
                path="/admin/dashboard"
                element={
                  <DashboardLayout>
                    <AdminDashboard />
                  </DashboardLayout>
                }
              />

              {/* =================================
                  ADMIN STORE MANAGEMENT
              ================================= */}

              <Route
                path="/admin/stores"
                element={
                  <DashboardLayout>
                    <Placeholder
                      title="Store Management"
                    />
                  </DashboardLayout>
                }
              />

              {/* =================================
                  ADMIN USER MANAGEMENT
              ================================= */}

            <Route
              path="/admin/users"
              element={
                <DashboardLayout>
                  <AdminUsers />
                </DashboardLayout>
              }
            />

            </Route>

            {/* =====================================
                NORMAL USER
            ===================================== */}

            <Route
              element={
                <RoleRoute
                  allowedRoles={["USER"]}
                />
              }
            >

              <Route
                path="/stores"
                element={
                  <DashboardLayout>
                    <Placeholder
                      title="Stores"
                    />
                  </DashboardLayout>
                }
              />

              <Route
                path="/my-ratings"
                element={
                  <DashboardLayout>
                    <Placeholder
                      title="My Ratings"
                    />
                  </DashboardLayout>
                }
              />

              <Route
                path="/profile"
                element={
                  <DashboardLayout>
                    <Placeholder
                      title="Profile"
                    />
                  </DashboardLayout>
                }
              />

            </Route>

            {/* =====================================
                STORE OWNER
            ===================================== */}

            <Route
              element={
                <RoleRoute
                  allowedRoles={["STORE_OWNER"]}
                />
              }
            >

              <Route
                path="/store-owner/dashboard"
                element={
                  <DashboardLayout>
                    <Placeholder
                      title="Store Owner Dashboard"
                    />
                  </DashboardLayout>
                }
              />

              <Route
                path="/store-owner/ratings"
                element={
                  <DashboardLayout>
                    <Placeholder
                      title="Ratings"
                    />
                  </DashboardLayout>
                }
              />

              <Route
                path="/store-owner/profile"
                element={
                  <DashboardLayout>
                    <Placeholder
                      title="Profile"
                    />
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
                to="/login"
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