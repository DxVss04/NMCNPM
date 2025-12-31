import React, { useState, useEffect } from "react";
import axios from "axios";
import PassPopup from "../../components/passPopup/passPopup";
import "./Profile.css";

export default function Profile() {
  const [userData, setUserData] = useState({
    identification: "",
    name: "",
    phone: "",
    address: "",
    dob: "",
  });
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [showPassPopup, setShowPassPopup] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Lấy thông tin người dùng khi component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userId = sessionStorage.getItem("userId");
      if (!userId) {
        setError("Không tìm thấy thông tin đăng nhập");
        return;
      }

      setLoading(true);
      const response = await axios.get(`${API_URL}/user/my-profile`, {
        params: { userId },
      });

      if (response.data && response.data.user) {
        const user = response.data.user;
        setUserData({
          identification: user.identification || "",
          name: user.name || "",
          phone: user.phone || "",
          address: user.address || "",
          dob: user.dob ? new Date(user.dob).toLocaleDateString("vi-VN") : "",
        });
        setPhone(user.phone || "");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Không thể tải thông tin người dùng";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setToast("");
    setLoading(true);

    try {
      const userId = sessionStorage.getItem("userId");
      if (!userId) {
        setError("Không tìm thấy thông tin đăng nhập");
        setLoading(false);
        return;
      }

      const response = await axios.patch(`${API_URL}/user/update-profile`, {
        userId,
        phone,
      });

      if (response.data && response.data.user) {
        setUserData((prev) => ({
          ...prev,
          phone: response.data.user.phone,
        }));
        setToast("Cập nhật thông tin thành công!");
        setTimeout(() => setToast(""), 3000);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Cập nhật thông tin thất bại";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPassPopup = () => {
    setShowPassPopup(true);
  };

  const handleClosePassPopup = () => {
    setShowPassPopup(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <h2 className="profile-title">Thông tin cá nhân</h2>
            <p className="profile-subtitle">Quản lý thông tin tài khoản của bạn</p>
          </div>

          {error && (
            <div className="profile-error">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {toast && (
            <div className="profile-toast">
              <span className="toast-icon">✓</span>
              <span>{toast}</span>
            </div>
          )}

          {loading && !userData.identification ? (
            <div className="profile-loading">
              <span className="loading-spinner">⏳</span>
              <span>Đang tải thông tin...</span>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">🆔</span>
                  CCCD / CMND
                </label>
                <input
                  className="form-input form-input-disabled"
                  type="text"
                  value={userData.identification}
                  disabled
                  readOnly
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">👤</span>
                  Họ và tên
                </label>
                <input
                  className="form-input form-input-disabled"
                  type="text"
                  value={userData.name}
                  disabled
                  readOnly
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">📞</span>
                  Số điện thoại
                </label>
                <input
                  className="form-input"
                  type="text"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="Nhập số điện thoại"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">📍</span>
                  Địa chỉ
                </label>
                <input
                  className="form-input form-input-disabled"
                  type="text"
                  value={userData.address}
                  disabled
                  readOnly
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">📅</span>
                  Ngày sinh
                </label>
                <input
                  className="form-input form-input-disabled"
                  type="text"
                  value={userData.dob}
                  disabled
                  readOnly
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="button-spinner">⏳</span>
                      Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <span className="button-icon">💾</span>
                      Lưu thay đổi
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleOpenPassPopup}
                  disabled={loading}
                >
                  <span className="button-icon">🔒</span>
                  Đổi mật khẩu
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {showPassPopup && (
        <PassPopup
          onClose={handleClosePassPopup}
          onSuccess={() => {
            setShowPassPopup(false);
            setToast("Đổi mật khẩu thành công!");
            setTimeout(() => setToast(""), 3000);
          }}
        />
      )}
    </div>
  );
}
