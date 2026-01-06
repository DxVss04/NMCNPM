import React, { useState, useRef, useEffect } from 'react';
import './residentItem.css';

const ResidentItem = ({ household, onViewMembers, onAddMember, onDeleteHousehold, onEditMember, onDeleteMember }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  // Tạo danh sách thành viên bao gồm chủ hộ
  const getAllMembers = () => {
    const members = [...(household.members || [])];
    
    // Kiểm tra xem chủ hộ đã có trong members chưa
    const headExists = members.some(
      m => m.identification === household.identification_head
    );

    // Nếu chủ hộ chưa có trong members, thêm vào đầu danh sách
    if (!headExists && household.namehead && household.identification_head) {
      members.unshift({
        _id: `head-${household._id}`,
        identification: household.identification_head,
        name: household.namehead,
        relationship: 'chu ho gia dinh',
        isHead: true
      });
    }

    return members;
  };

  const members = getAllMembers();

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleViewMembers = () => {
    setShowMembers(!showMembers);
    setShowMenu(false);
  };

  const handleAddMember = () => {
    onAddMember(household._id);
    setShowMenu(false);
  };

  const handleDeleteHousehold = () => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa hộ gia đình "${household.namehousehold}"?`)) {
      onDeleteHousehold(household._id);
    }
    setShowMenu(false);
  };

  const handleDeleteMember = (memberId, memberName) => {
    // Kiểm tra xem member có phải chủ hộ không bằng cách so sánh name với household.namehead
    const isHead = memberName === household.namehead;
    
    if (isHead) {
      // Xác nhận xóa chủ hộ - xác nhận đã được xử lý trong Residents.jsx
      onDeleteMember(memberId, household._id, true, memberName);
    } else {
      if (window.confirm(`Bạn có chắc chắn muốn xóa thành viên "${memberName}"?`)) {
        onDeleteMember(memberId, household._id, false, memberName);
      }
    }
  };

  return (
    <div className="resident-item" id={`household-${household._id}`}>
      <div className="resident-header">
        <div className="resident-info">
          <h3 className="resident-name">{household.namehousehold}</h3>
          <p className="resident-address">
            <span>📍</span>
            {household.address}
          </p>
        </div>
        <div className="resident-menu-container" ref={menuRef}>
          <button className="menu-toggle" onClick={handleMenuToggle}>
            <span className="menu-dots">⋯</span>
          </button>
          {showMenu && (
            <div className="menu-dropdown">
              <button className="menu-item menu-item-view" onClick={handleViewMembers}>
                <span className="menu-icon">👁️</span>
                <span>{showMembers ? 'Ẩn' : 'Hiển thị'} thành viên</span>
              </button>
              <button className="menu-item menu-item-add-member" onClick={handleAddMember}>
                <span className="menu-icon">➕</span>
                <span>Thêm thành viên</span>
              </button>
              <button className="menu-item menu-item-delete" onClick={handleDeleteHousehold}>
                <span className="menu-icon">🗑️</span>
                <span>Xóa hộ gia đình</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="resident-details">
        <div className="detail-row">
          <span className="detail-label">Chủ hộ</span>
          <span className="detail-value">{household.namehead}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">CCCD Chủ hộ</span>
          <span className="detail-value">{household.identification_head}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Số thành viên</span>
          <span className="detail-value">{members.length}</span>
        </div>
      </div>

      {showMembers && (
        <div className="members-section">
          <h4 className="members-title">
            <span>👥</span>
            Danh sách thành viên ({members.length})
          </h4>
          {members.length > 0 ? (
            <div className="members-list">
              {members.map((member, index) => (
                <div key={member._id || index} className="member-card" data-member-id={member._id}>
                  <div className="member-info">
                    <div className="member-detail">
                      <span className="member-label">Tên</span>
                      <span className="member-value">
                        {member.name}
                        {member.isHead && <span style={{ color: '#667eea', marginLeft: '8px', fontWeight: 'bold' }}>(Chủ hộ)</span>}
                      </span>
                    </div>
                    <div className="member-detail">
                      <span className="member-label">CCCD</span>
                      <span className="member-value">{member.identification}</span>
                    </div>
                    <div className="member-detail">
                      <span className="member-label">Quan hệ</span>
                      <span className="member-value">{member.relationship}</span>
                    </div>
                  </div>
                  <div className="member-actions">
                    <button
                      className="btn-member btn-edit-member"
                      onClick={() => onEditMember(member, household._id)}
                      title="Sửa thành viên"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-member btn-delete-member"
                      onClick={() => handleDeleteMember(member._id, member.name)}
                      title="Xóa thành viên"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-members">Chưa có thành viên nào</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResidentItem;
