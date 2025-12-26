import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const { pathname } = useLocation();
  
  // Tạo 2 state riêng biệt cho 2 menu đa cấp
  // Phải tạo riêng không sẽ bị lẫn và đè lên nhau
  const [residentsOpen, setResidentsOpen] = useState(pathname.startsWith("/residents"));
  const [billsOpen, setBillsOpen] = useState(pathname.startsWith("/bills"));

  return (
    <aside className="admin-sidebar" aria-label="sidebar">
      <div className="sidebar-inner">
        <div className="brand">Admin</div>

        <nav className="nav">
          <NavLink to="/statistics" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>Thống kê</NavLink>

          {/* Phần Cư dân */}
          <div className={`nav-section ${residentsOpen ? "open" : ""}`}>
            <button
              type="button"
              className="nav-section-toggle"
              onClick={() => setResidentsOpen(!residentsOpen)} // Chỉ tác động đến residentsOpen
              aria-expanded={residentsOpen}
            >
              <span>Cư dân</span>
              <span className={`chev ${residentsOpen ? "open" : ""}`}>▾</span>
            </button>

            {residentsOpen && (
              <>
                <NavLink to="/residents" end className={({ isActive }) => (isActive ? "nav-item nav-child active" : "nav-item nav-child")}>List cư dân</NavLink>
                <NavLink to="/residents/add" className={() => (pathname.startsWith("/residents/add") || pathname.startsWith("/residents/edit") ? "nav-item nav-child active" : "nav-item nav-child")}>Thao tác</NavLink>
              </>
            )}
          </div>

          <NavLink to="/meters" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>Chỉ số điện nước</NavLink>
          <NavLink to="/posts" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>Bài đăng</NavLink>

          {/* Phần Hóa đơn - Đã sửa lỗi ở đây */}
          <div className={`nav-section ${billsOpen ? "open" : ""}`}>
            <button
              type="button"
              className="nav-section-toggle"
              onClick={() => setBillsOpen(!billsOpen)} // Chỉ tác động đến billsOpen
              aria-expanded={billsOpen}
            >
              <span>Hóa đơn</span>
              <span className={`chev ${billsOpen ? "open" : ""}`}>▾</span>
            </button>
            
            {/* Hiển thị dựa trên state billsOpen thay vì chỉ dựa trên pathname */}
            {billsOpen && (
              <>
                <NavLink to="/bills" end className={({ isActive }) => (isActive ? "nav-item nav-child active" : "nav-item nav-child")}>Danh sách hóa đơn</NavLink>
                <NavLink to="/bills/add" className={({ isActive }) => (isActive ? "nav-item nav-child active" : "nav-item nav-child")}>Thêm hóa đơn</NavLink>
                <NavLink to="/bills/overdue" className={({ isActive }) => (isActive ? "nav-item nav-child active" : "nav-item nav-child")}>Hóa đơn quá hạn</NavLink>
              </>
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
}