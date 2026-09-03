import { useEffect, useState } from "react";
import {
  Users,
  Store,
  Star,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";

import api from "../../services/api";

import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/dashboard");

      console.log("Admin dashboard response:", response.data);

      setDashboard(response.data);
    } catch (err) {
      console.error("Dashboard error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  /*
   * Your backend response may contain the statistics directly
   * or inside a data object.
   *
   * These helpers allow the frontend to handle either structure
   * without creating fake data.
   */
  const getDashboardValue = (...keys) => {
    const sources = [
      dashboard,
      dashboard?.data,
      dashboard?.dashboard,
    ];

    for (const source of sources) {
      if (!source) continue;

      for (const key of keys) {
        if (
          source[key] !== undefined &&
          source[key] !== null
        ) {
          return source[key];
        }
      }
    }

    return 0;
  };

  const totalUsers = getDashboardValue(
    "totalUsers",
    "total_users",
    "users"
  );

  const totalStores = getDashboardValue(
    "totalStores",
    "total_stores",
    "stores"
  );

  const totalRatings = getDashboardValue(
    "totalRatings",
    "total_ratings",
    "ratings"
  );

  const cards = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      description: "Registered platform users",
    },
    {
      title: "Total Stores",
      value: totalStores,
      icon: Store,
      description: "Stores registered on platform",
    },
    {
      title: "Total Ratings",
      value: totalRatings,
      icon: Star,
      description: "Ratings submitted by users",
    },
  ];

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <div>
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-subtitle" />
          </div>
        </div>

        <div className="dashboard-cards">
          {[1, 2, 3].map((item) => (
            <div
              className="dashboard-card skeleton-card"
              key={item}
            >
              <div className="skeleton skeleton-icon" />

              <div className="skeleton-content">
                <div className="skeleton skeleton-small" />
                <div className="skeleton skeleton-number" />
                <div className="skeleton skeleton-text" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Overview of your StoreRate platform.</p>
          </div>
        </div>

        <div className="dashboard-error">
          <div className="error-icon">
            <AlertCircle size={24} />
          </div>

          <div>
            <h3>Unable to load dashboard</h3>
            <p>{error}</p>
          </div>

          <button
            type="button"
            onClick={fetchDashboard}
            className="retry-button"
          >
            <RefreshCw size={17} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div>
          <span className="dashboard-eyebrow">
            ADMIN PANEL
          </span>

          <h1>Dashboard</h1>

          <p>
            Overview of your StoreRate platform.
          </p>
        </div>

        <button
          type="button"
          className="refresh-button"
          onClick={fetchDashboard}
          title="Refresh dashboard"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </motion.div>

      <div className="dashboard-cards">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <motion.div
              className="dashboard-card"
              key={card.title}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
                delay: index * 0.08,
              }}
              whileHover={{
                y: -5,
              }}
            >
              <div className="dashboard-card-top">
                <div className="dashboard-card-icon">
                  <Icon size={23} />
                </div>

                <span className="card-status">
                  LIVE
                </span>
              </div>

              <div className="dashboard-card-content">
                <p>{card.title}</p>

                <h2>
                  {Number(card.value).toLocaleString()}
                </h2>

                <span>{card.description}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className="dashboard-welcome-card"
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
          delay: 0.3,
        }}
      >
        <div>
          <span className="dashboard-eyebrow">
            STO RERATE
          </span>

          <h2>Platform Overview</h2>

          <p>
            Manage users, stores, and platform
            activity from the administration panel.
          </p>
        </div>

        <Store size={42} />
      </motion.div>
    </div>
  );
};

export default AdminDashboard;