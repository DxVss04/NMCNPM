import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/Context/AuthContext.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import Members from "./pages/Members/Members.jsx";
import Bills from "./pages/Bills/Bills.jsx";
import Posts from "./pages/Posts/Posts.jsx";
import Contact from "./components/Footer/Footer.jsx";
import History from "./components/History/History.jsx";
import React from "react";
import DashboardLayout from "./components/Layout/DashboardLayout.jsx";


export default function App() {
	return (
		<AuthProvider>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />

				<Route
					path="/"
					element={
						<ProtectedRoute>
							<DashboardLayout />
						</ProtectedRoute>
					}
				>
					<Route index element={<Profile />} />
					<Route path="profile" element={<Profile />} />
					<Route path="members" element={<Members />} />
					<Route path="bills" element={<Bills />} />
					<Route path="posts" element={<Posts />} />
					<Route path="history" element={<History />} />
					<Route path="contact" element={<Contact />} />
				</Route>
			</Routes>
		</AuthProvider>
	);
}