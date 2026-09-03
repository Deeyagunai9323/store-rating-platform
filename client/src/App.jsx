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

const Placeholder = ({ title }) => {
  return (
    <div
      style={{
        padding: "40px",
      }}
    >
      <h1>{title}</h1>
      <p>
        This module will be implemented next.
      </p>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* =========================
              PUBLIC ROUTES
          ========================= */}

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

          {/* =========================
              PROTECTED ROUTES
          ========================= */}

          <Route element={<ProtectedRoute />}>

            {/* ADMIN */}

            <Route
              element={
                <RoleRoute
                  allowedRoles={["ADMIN"]}
                />
              }
            >
              <Route
                path="/admin/dashboard"
                element={
                  <Placeholder
                    title="Admin Dashboard"
                  />
                }
              />
            </Route>

            {/* NORMAL USER */}

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
                  <Placeholder
                    title="Store Listing"
                  />
                }
              />
            </Route>

            {/* STORE OWNER */}

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
                  <Placeholder
                    title="Store Owner Dashboard"
                  />
                }
              />
            </Route>

          </Route>

          {/* =========================
              FALLBACK
          ========================= */}

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