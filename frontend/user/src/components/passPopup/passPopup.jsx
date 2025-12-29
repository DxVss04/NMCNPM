import React, { useState } from "react";
import "./passPopup.css";

const PassPopup = ({ identification, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    identification: identification || "",
    oldPassword: "",
    newPassword: "",
  });
  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.oldPassword || !formData.newPassword || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (formData.newPassword !== confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      setError("Mật khẩu mới phải khác mật khẩu cũ.");
      return;
    }

    try {
      await onSubmit(formData);
      // Reset form on success
      setFormData({
        identification: identification || "",
        oldPassword: "",
        newPassword: "",
      });
      setConfirmPassword("");
    } catch (err) {
      // Error is handled in parent component
    }
  };

  const handleClose = () => {
    setFormData({
      identification: identification || "",
      oldPassword: "",
      newPassword: "",
    });
    setConfirmPassword("");
    setError("");
    onClose();
  };

  return (
    <div className="pass-popup-overlay" onClick={handleClose}>
      <div className="pass-popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="pass-popup-header">
          <h2 className="pass-popup-title">Đổi mật khẩu</h2>
          <button className="pass-popup-close" onClick={handleClose}>
            ×
          </button>
        </div>

        {error && (
          <div className="pass-popup-error">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="pass-popup-form">
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">🆔</span>
              CCCD / CMND
            </label>
            <input
              type="text"
              className="form-input"
              value={formData.identification}
              readOnly
              disabled
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">🔒</span>
              Mật khẩu cũ
            </label>
            <input
              type="password"
              name="oldPassword"
              className="form-input"
              value={formData.oldPassword}
              onChange={handleChange}
              placeholder="Nhập mật khẩu cũ"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">🔐</span>
              Mật khẩu mới
            </label>
            <input
              type="password"
              name="newPassword"
              className="form-input"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Nhập mật khẩu mới"
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">🔐</span>
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              name="confirmPassword"
              className="form-input"
              value={confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu mới"
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <div className="pass-popup-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleClose}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn-confirm"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="button-spinner">⏳</span>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <span className="button-icon">✓</span>
                  Xác nhận
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PassPopup;
