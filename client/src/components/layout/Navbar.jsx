import { useState } from "react";
import {
  Menu,
  X,
  LogOut,
  UserCircle,
  ChevronDown,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const Navbar = ({ onMenuClick }) => {
  const { user, role, logout } = useAuth();

  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
  };

  const getInitials = () => {
    if (!user?.name) {
      return "U";
    }

    return user.name
      .trim()
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <header className="navbar">

      {/* LEFT */}

      <div className="navbar-left">

        <button
          type="button"
          className="mobile-menu-button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>

        <div className="navbar-brand">
          <div className="brand-icon">
            ★
          </div>

          <span>StoreRate</span>
        </div>

      </div>

      {/* RIGHT */}

      <div className="navbar-right">

        <div className="profile-wrapper">

          <button
            type="button"
            className="profile-button"
            onClick={() =>
              setProfileOpen((previous) => !previous)
            }
            aria-expanded={profileOpen}
          >

            <div className="profile-avatar">
              {getInitials()}
            </div>

            <div className="profile-info">

              <span className="profile-name">
                {user?.name || "User"}
              </span>

              <span className="profile-role">
                {role || "USER"}
              </span>

            </div>

            <ChevronDown
              size={16}
              className={
                profileOpen
                  ? "profile-chevron rotate"
                  : "profile-chevron"
              }
            />

          </button>

          {/* DROPDOWN */}

          {profileOpen && (
            <div className="profile-dropdown">

              <div className="dropdown-user">

                <div className="profile-avatar large">
                  {getInitials()}
                </div>

                <div>
                  <strong>
                    {user?.name || "User"}
                  </strong>

                  <span>
                    {user?.email || ""}
                  </span>

                  <small>
                    {role || "USER"}
                  </small>
                </div>

              </div>

              <div className="dropdown-divider" />

              <button
                type="button"
                className="dropdown-logout"
                onClick={handleLogout}
              >
                <LogOut size={17} />

                <span>
                  Logout
                </span>
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
};

export default Navbar;