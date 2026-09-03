import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Store,
  Users,
  Star,
  UserCircle,
  Settings,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ isOpen, onClose }) => {
  const { role } = useAuth();

  const navigation = {
    ADMIN: [
      {
        label: "Dashboard",
        path: "/admin/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Stores",
        path: "/admin/stores",
        icon: Store,
      },
      {
        label: "Users",
        path: "/admin/users",
        icon: Users,
      },
    ],

    USER: [
      {
        label: "Stores",
        path: "/stores",
        icon: Store,
      },
      {
        label: "My Ratings",
        path: "/my-ratings",
        icon: Star,
      },
      {
        label: "Profile",
        path: "/profile",
        icon: UserCircle,
      },
    ],

    STORE_OWNER: [
      {
        label: "Dashboard",
        path: "/store-owner/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Ratings",
        path: "/store-owner/ratings",
        icon: Star,
      },
      {
        label: "Profile",
        path: "/store-owner/profile",
        icon: UserCircle,
      },
    ],
  };

  const links = navigation[role] || [];

  return (
    <>
      {/* MOBILE OVERLAY */}

      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={
          isOpen
            ? "sidebar sidebar-open"
            : "sidebar"
        }
      >

        {/* MOBILE CLOSE */}

        <button
          type="button"
          className="sidebar-close"
          onClick={onClose}
          aria-label="Close navigation menu"
        >
          <X size={22} />
        </button>

        {/* SIDEBAR HEADER */}

        <div className="sidebar-header">

          <span className="sidebar-section-title">
            Workspace
          </span>

          <span className="sidebar-role">
            {role || "USER"}
          </span>

        </div>

        {/* NAVIGATION */}

        <nav className="sidebar-nav">

          {links.map((item) => {

            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  isActive
                    ? "sidebar-link active"
                    : "sidebar-link"
                }
              >

                <Icon size={19} />

                <span>
                  {item.label}
                </span>

              </NavLink>
            );

          })}

        </nav>

        {/* BOTTOM */}

        <div className="sidebar-bottom">

          <div className="sidebar-tip">

            <Settings size={18} />

            <div>
              <strong>
                StoreRate
              </strong>

              <span>
                Store rating platform
              </span>
            </div>

          </div>

        </div>

      </aside>
    </>
  );
};

export default Sidebar;