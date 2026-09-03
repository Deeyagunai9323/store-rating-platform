import {
  useState,
} from "react";

import {
  UserCircle,
  Lock,
  LoaderCircle,
} from "lucide-react";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  changePassword,
} from "../../services/user.service";

import "./UserProfile.css";


const UserProfile = () => {

  const {
    user,
  } = useAuth();


  const [
    formData,
    setFormData,
  ] = useState({
    current_password: "",
    new_password: "",
  });


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  const [
    success,
    setSuccess,
  ] = useState("");


  const handleChange = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

  };


  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {

      await changePassword(
        formData
      );

      setSuccess(
        "Password updated successfully."
      );

      setFormData({
        current_password: "",
        new_password: "",
      });

    } catch (err) {

      console.error(err);

      const backendMessage =
        err.response?.data?.message;

      const validationErrors =
        err.response?.data?.errors;

      if (
        Array.isArray(
          validationErrors
        )
      ) {

        setError(
          validationErrors
            .map(
              (item) =>
                item.msg ||
                item.message
            )
            .join(", ")
        );

      } else {

        setError(
          backendMessage ||
          "Unable to update password."
        );

      }

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="user-profile-page">

      <div className="user-page-header">

        <div>

          <span className="page-eyebrow">
            ACCOUNT
          </span>

          <h1>
            Profile
          </h1>

          <p>
            View your account and manage
            your password.
          </p>

        </div>

      </div>


      {/* PROFILE */}

      <div className="profile-card">

        <div className="profile-avatar">

          {user?.name
            ?.charAt(0)
            ?.toUpperCase()}

        </div>

        <div>

          <h2>
            {user?.name || "User"}
          </h2>

          <p>
            {user?.email}
          </p>

          <span>
            {user?.role || "USER"}
          </span>

        </div>

      </div>


      {/* ACCOUNT INFORMATION */}

      <div className="profile-info-card">

        <h2>
          Account Information
        </h2>

        <div className="profile-grid">

          <div>
            <span>
              Name
            </span>

            <strong>
              {user?.name || "—"}
            </strong>
          </div>

          <div>
            <span>
              Email
            </span>

            <strong>
              {user?.email || "—"}
            </strong>
          </div>

          <div>
            <span>
              Address
            </span>

            <strong>
              {user?.address || "—"}
            </strong>
          </div>

          <div>
            <span>
              Role
            </span>

            <strong>
              {user?.role || "USER"}
            </strong>
          </div>

        </div>

      </div>


      {/* PASSWORD */}

      <div className="profile-info-card">

        <div className="password-heading">

          <Lock size={20} />

          <div>

            <h2>
              Change Password
            </h2>

            <p>
              Use a new password between
              8 and 16 characters.
            </p>

          </div>

        </div>


        {error && (
          <div className="error-alert">
            {error}
          </div>
        )}


        {success && (
          <div className="success-alert">
            {success}
          </div>
        )}


        <form
          onSubmit={handleSubmit}
          className="password-form"
        >

          <div className="form-field">

            <label>
              Current Password
            </label>

            <input
              type="password"
              name="current_password"
              value={
                formData.current_password
              }
              onChange={handleChange}
              required
              disabled={loading}
            />

          </div>


          <div className="form-field">

            <label>
              New Password
            </label>

            <input
              type="password"
              name="new_password"
              value={
                formData.new_password
              }
              onChange={handleChange}
              minLength={8}
              maxLength={16}
              required
              disabled={loading}
            />

          </div>


          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >

            {loading ? (

              <>
                <LoaderCircle
                  size={18}
                  className="spin"
                />

                Updating...
              </>

            ) : (

              <>
                <UserCircle size={18} />

                Update Password
              </>

            )}

          </button>

        </form>

      </div>

    </div>

  );

};

export default UserProfile;