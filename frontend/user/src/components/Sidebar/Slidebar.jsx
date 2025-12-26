import { NavLink } from "react-router-dom";
import React from "react";
import "./Slidebar.css";
import { Images } from "../../assets/assets";

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <h2 className="sb-brand">Blue Moon</h2>
            <img src={Images.logo} alt="Blue Moon logo" className="sb-logo" />
            <nav>
                <ul>
                    <li>
                        <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>Hồ sơ</NavLink>
                    </li>
                    <li>
                        <NavLink to="/members" className={({ isActive }) => (isActive ? "active" : "")}>Thành viên</NavLink>
                    </li>
                    <li>
                        <NavLink to="/bills" className={({ isActive }) => (isActive ? "active" : "")}>Hóa đơn</NavLink>
                    </li>
                    <li>
                        <NavLink to="/history" className={({ isActive }) => (isActive ? "active" : "")}>Lịch sử</NavLink>
                    </li>
                    <li>
                        <NavLink to="/posts" className={({ isActive }) => (isActive ? "active" : "")}>Thông báo</NavLink>
                    </li>
                    <li>
                        <NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")}>Liên hệ</NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}