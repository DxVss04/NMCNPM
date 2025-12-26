import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Slidebar.jsx";
import Header from "../Header/Header.jsx";
import "./DashboardLayout.css";

export default function DashboardLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
