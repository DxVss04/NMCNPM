import React, { useState, useEffect, useRef } from 'react';
import './postPopup.css';

const PostPopup = ({ post, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    isPinned: false
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || '';

  const isEditMode = !!post;

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        content: post.content || '',
        imageUrl: post.imageUrl || '',
        isPinned: post.isPinned || false
      });
      // Set preview for existing image
      if (post.imageUrl) {
        const imageUrl = post.imageUrl.startsWith('http') 
          ? post.imageUrl 
          : `${API_URL}${post.imageUrl}`;
        setImagePreview(imageUrl);
      } else {
        setImagePreview(null);
      }
    } else {
      // Reset form for new post
      setFormData({
        title: '',
        content: '',
        imageUrl: '',
        isPinned: false
      });
      setImagePreview(null);
      setSelectedFile(null);
    }
  }, [post, API_URL]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh (jpg, png, etc.)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước file không được vượt quá 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Clear imageUrl when removing image
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Vui lòng điền đầy đủ tiêu đề và nội dung');
      return;
    }
    
    // Pass both formData and selectedFile to parent
    onSave({
      ...formData,
      file: selectedFile
    });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="popup-overlay" onClick={handleOverlayClick}>
      <div className="popup-content">
        <div className="popup-header">
          <h2>{isEditMode ? 'Sửa bài viết' : 'Tạo bài viết mới'}</h2>
          <button className="popup-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="popup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Tiêu đề *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Nhập tiêu đề bài viết"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Nội dung *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Nhập nội dung bài viết"
              rows="6"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="imageFile">Hình ảnh</label>
            <input
              type="file"
              id="imageFile"
              name="imageFile"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <div className="file-upload-container">
              <button
                type="button"
                className="btn-choose-file"
                onClick={() => fileInputRef.current?.click()}
              >
                {selectedFile ? 'Chọn ảnh khác' : imagePreview ? 'Thay đổi ảnh' : 'Chọn file ảnh từ máy, ví dụ: *.jpg/.png'}
              </button>
              {imagePreview && (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button
                    type="button"
                    className="btn-remove-image"
                    onClick={handleRemoveImage}
                    title="Xóa ảnh"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isPinned"
                checked={formData.isPinned}
                onChange={handleChange}
              />
              <span>Ghim bài viết</span>
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn-submit">
              {isEditMode ? 'Lưu thay đổi' : 'Đăng bài'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostPopup;
