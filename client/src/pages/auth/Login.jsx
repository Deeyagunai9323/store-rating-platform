import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LogIn,
  Mail,
  LoaderCircle,
  Store,
} from "lucide-react";

import PasswordInput from "../../components/common/PasswordInput";
import { loginUser } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";

import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  // =====================================================
  // ERROR MESSAGE
  // =====================================================

  const getErrorMessage = (err) => {
    return (
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "Unable to login. Please check your credentials."
    );
  };

  // =====================================================
  // ROLE BASED REDIRECTION
  // =====================================================

  const redirectByRole = (user) => {
    /*
      Your backend roles are:

      ADMIN
      USER
      STORE_OWNER
    */

    const role = (
      user?.role ||
      user?.role_name ||
      user?.roleName ||
      ""
    ).toUpperCase();

    switch (role) {
      case "ADMIN":
        navigate("/admin/dashboard", {
          replace: true,
        });
        break;

      case "USER":
        navigate("/stores", {
          replace: true,
        });
        break;

      case "STORE_OWNER":
        navigate("/store-owner/dashboard", {
          replace: true,
        });
        break;

      default:
        setError(
          "Your account does not have a valid role."
        );
    }
  };

  // =====================================================
  // SUBMIT LOGIN
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    setLoading(true);

    try {
      // Call existing backend login API
      const response = await loginUser(formData);

      console.log("Login response:", response);

      /*
        Save JWT + user inside AuthContext.

        login() should return the logged-in user.
      */

      const loggedInUser = login(response);

      /*
        Redirect according to backend role.
      */

      redirectByRole(loggedInUser);
    } catch (err) {
      console.error("Login error:", err);

      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="auth-page">

      <div className="auth-background-orb orb-one" />

      <div className="auth-background-orb orb-two" />

      <div className="auth-card">

        {/* BRAND */}

        <div className="auth-brand">

          <div className="auth-logo">
            <Store size={28} />
          </div>

          <h1>StoreRate</h1>

          <p>
            Discover stores. Share ratings.
          </p>

        </div>

        {/* HEADING */}

        <div className="auth-heading">

          <h2>Welcome back</h2>

          <p>
            Sign in to continue to your account.
          </p>

        </div>

        {/* ERROR */}

        {error && (
          <div
            className="auth-error"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* LOGIN FORM */}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          {/* EMAIL */}

          <div className="form-group">

            <label htmlFor="email">
              Email
            </label>

            <div className="input-wrapper">

              <Mail
                size={18}
                className="input-icon"
              />

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
                disabled={loading}
              />

            </div>

          </div>

          {/* PASSWORD */}

          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <PasswordInput
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />

          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >

            {loading ? (
              <>
                <LoaderCircle
                  size={18}
                  className="spin"
                />

                Signing in...
              </>
            ) : (
              <>
                <LogIn size={18} />

                Sign in
              </>
            )}

          </button>

        </form>

        {/* REGISTER */}

        <div className="auth-footer">

          <span>
            Don't have an account?
          </span>

          <Link to="/register">
            Create account
          </Link>

        </div>

      </div>

    </div>
  );
};

export default Login;