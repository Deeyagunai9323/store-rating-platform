import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  MapPin,
  UserPlus,
  LoaderCircle,
  Store,
} from "lucide-react";

import PasswordInput from "../../components/common/PasswordInput";
import { registerUser } from "../../services/auth.service";

import "./Auth.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    const nameLength = formData.name.trim().length;

    if (nameLength < 20 || nameLength > 60) {
      return "Name must be between 20 and 60 characters.";
    }

    if (formData.address.length > 400) {
      return "Address cannot exceed 400 characters.";
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

    if (!passwordRegex.test(formData.password)) {
      return "Password must be 8-16 characters and include at least one uppercase letter and one special character.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        password: formData.password,
      });

      setSuccess(
        "Registration successful. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      console.error("Registration error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background-orb orb-one" />
      <div className="auth-background-orb orb-two" />

      <div className="auth-card register-card">
        <div className="auth-brand">
          <div className="auth-logo">
            <Store size={28} />
          </div>

          <h1>StoreRate</h1>

          <p>
            Join the store rating community.
          </p>
        </div>

        <div className="auth-heading">
          <h2>Create your account</h2>

          <p>
            Register as a normal user.
          </p>
        </div>

        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div
            className="auth-success"
            role="status"
          >
            {success}
          </div>
        )}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="name">
              Full Name
            </label>

            <div className="input-wrapper">
              <User
                size={18}
                className="input-icon"
              />

              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                minLength={20}
                maxLength={60}
                required
                disabled={loading}
              />
            </div>

            <small>
              {formData.name.length}/60 characters
            </small>
          </div>

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
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">
              Address
            </label>

            <div className="textarea-wrapper">
              <MapPin
                size={18}
                className="textarea-icon"
              />

              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                maxLength={400}
                rows={3}
                required
                disabled={loading}
              />
            </div>

            <small>
              {formData.address.length}/400 characters
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <PasswordInput
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />

            <small>
              8-16 characters, one uppercase letter and one
              special character.
            </small>
          </div>

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

                Creating account...
              </>
            ) : (
              <>
                <UserPlus size={18} />

                Create account
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account?</span>

          <Link to="/login">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;