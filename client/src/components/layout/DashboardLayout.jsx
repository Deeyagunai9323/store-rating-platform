import { useState } from "react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

import "./Layout.css";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(
      (previous) => !previous
    );
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="app-layout">

      <Navbar
        onMenuClick={toggleSidebar}
      />

      <div className="app-body">

        <Sidebar
          isOpen={sidebarOpen}
          onClose={closeSidebar}
        />

        <main className="main-content">

          <div className="page-content">
            {children}
          </div>

          <Footer />

        </main>

      </div>

    </div>
  );
};

export default DashboardLayout;