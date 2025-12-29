import React, { useState } from "react";
import "./passPopup.css";

const PassPopup = ({ onClose, onConfirm }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!currentPassword || !newPassword) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    // Call onConfirm with password data
    onConfirm({
      currentPassword,
      newPassword,
    });

    // Reset form after confirmation
    setCurrentPassword("");
    setNewPassword("");
    setError("");
  };

  const handleClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setError("");
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div className="pass-popup-overlay" onClick={handleOverlayClick}>
      <div className="pass-popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="pass-popup-header">
          <h2 className="pass-popup-title">Đổi mật khẩu</h2>
          <button className="pass-popup-close" onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="pass-popup-form">
          {error && <div className="pass-popup-error">{error}</div>}

          <div className="pass-popup-field">
            <label className="pass-popup-label">Mật khẩu cũ</label>
            <input
              type="password"
              className="pass-popup-input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Nhập mật khẩu cũ"
              required
            />
          </div>

          <div className="pass-popup-field">
            <label className="pass-popup-label">Mật khẩu mới</label>
            <input
              type="password"
              className="pass-popup-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới"
              required
            />
          </div>

          <div className="pass-popup-actions">
            <button type="button" className="pass-popup-cancel" onClick={handleClose}>
              Hủy
            </button>
            <button type="submit" className="pass-popup-confirm">
              Xác nhận
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PassPopup;

