import React, { useState, useEffect } from "react";
import axios from "axios";
import PassPopup from "../../components/passPopup/passPopup";
import "./Profile.css";
import profileFields from "./Profile.json";

const Profile = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  
  const [userData, setUserData] = useState({
    identification: "",
    name: "",
    phone: "",
    address: "",
    dob: "",
  });
  
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassPopup, setShowPassPopup] = useState(false);

  // Lấy userID từ sessionStorage
  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = sessionStorage.getItem("userID");
      
      if (!userId) {
        setError("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
        return;
      }

      setLoading(true);
      setError("");
      
      try {
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
            dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
          });
          setPhone(user.phone || "");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          "Không thể tải thông tin người dùng. Vui lòng thử lại.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [API_URL]);

  // Xử lý cập nhật số điện thoại
  const handleUpdatePhone = async (e) => {
    e.preventDefault();
    
    if (phone === userData.phone) {
      setSuccess("Không có thay đổi nào.");
      setTimeout(() => setSuccess(""), 3000);
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.patch(`${API_URL}/user/update-profile`, {
        identification: userData.identification,
        phone: phone,
      });

      if (response.data && response.data.user) {
        setUserData((prev) => ({
          ...prev,
          phone: response.data.user.phone,
        }));
        setSuccess("Cập nhật số điện thoại thành công!");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Không thể cập nhật thông tin. Vui lòng thử lại.";
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Xử lý đổi mật khẩu
  const handleChangePassword = async (passwordData) => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.patch(`${API_URL}/user/update-profile`, {
        identification: passwordData.identification,
        currentPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.data) {
        setSuccess("Đổi mật khẩu thành công!");
        setShowPassPopup(false);
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Không thể đổi mật khẩu. Vui lòng thử lại.";
      setError(errorMessage);
      throw err; // Re-throw để passPopup có thể xử lý
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="profile-title">Thông tin cá nhân</h1>
          <p className="profile-subtitle">Quản lý thông tin tài khoản của bạn</p>
        </div>

        {error && (
          <div className="profile-error">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="profile-success">
            <span className="success-icon">✓</span>
            <span>{success}</span>
          </div>
        )}

        <div className="profile-card">
          <form onSubmit={handleUpdatePhone} className="profile-form">
            {profileFields.fields.map((field) => (
              <div key={field.name} className="form-group">
                <label className="form-label">
                  {field.label}
                  {field.editable && <span className="required">*</span>}
                </label>
                {field.name === "phone" ? (
                  <input
                    type="text"
                    className="form-input editable"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={`Nhập ${field.label.toLowerCase()}`}
                    disabled={saving}
                  />
                ) : (
                  <input
                    type={field.name === "dob" ? "date" : "text"}
                    className="form-input readonly"
                    value={
                      field.name === "dob"
                        ? userData.dob
                        : userData[field.name] || ""
                    }
                    readOnly
                    disabled
                  />
                )}
              </div>
            ))}

            <div className="form-actions">
              <button
                type="submit"
                className="btn-save"
                disabled={saving || phone === userData.phone}
              >
                {saving ? (
                  <>
                    <span className="button-spinner">⏳</span>
                    Đang lưu...
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
                className="btn-change-password"
                onClick={() => setShowPassPopup(true)}
                disabled={saving}
              >
                <span className="button-icon">🔒</span>
                Đổi mật khẩu
              </button>
            </div>
          </form>
        </div>
      </div>

      {showPassPopup && (
        <PassPopup
          identification={userData.identification}
          onClose={() => setShowPassPopup(false)}
          onSubmit={handleChangePassword}
          loading={saving}
        />
      )}
    </div>
  );
};

export default Profile;
