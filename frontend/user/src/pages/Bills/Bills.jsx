import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Bills.css';

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [household, setHousehold] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      setError('');
      
      const userId = sessionStorage.getItem('userId');
      if (!userId) {
        setError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/bills/user/${userId}/bills`);
      
      if (response.data) {
        setHousehold(response.data.household);
        setBills(response.data.bills || []);
      }
    } catch (err) {
      console.error('Error fetching bills:', err);
      const errorMessage = err.response?.data?.message || 'Không thể tải danh sách hóa đơn. Vui lòng thử lại sau.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getBillTypeLabel = (type) => {
    const typeMap = {
      electricity: 'Điện',
      water: 'Nước',
      garbage: 'Rác',
      management: 'Quản lý',
      parking: 'Gửi xe',
      other: 'Khác'
    };
    return typeMap[type] || type;
  };

  const getTotalBillAmount = (bill) => {
    if (bill.totalAmount) {
      return bill.totalAmount;
    }
    // Nếu không có totalAmount, tính từ billItem
    if (bill.billItem && typeof bill.billItem === 'object') {
      const { electric = 0, water = 0, internet = 0, other = 0 } = bill.billItem;
      return electric + water + internet + other;
    }
    return 0;
  };

  return (
    <div className="bills-page">
      <div className="bills-container">
        <div className="bills-header">
          <h1 className="bills-title">
            <span className="title-icon">📄</span>
            Hóa đơn của tôi
          </h1>
          {household && (
            <div className="household-info">
              <p className="household-name">{household.name}</p>
              <p className="household-address">{household.address}</p>
            </div>
          )}
        </div>

        {loading ? (
          <div className="loading-indicator">
            <div className="loading-spinner"></div>
            <p>Đang tải danh sách hóa đơn...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
          </div>
        ) : bills.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📋</span>
            <p>Chưa có hóa đơn nào.</p>
          </div>
        ) : (
          <div className="bills-list">
            {bills.map((bill) => {
              const totalAmount = getTotalBillAmount(bill);
              const isPaid = bill.status === 'paid' || bill.status === true;
              
              return (
                <div key={bill._id} className={`bill-card ${isPaid ? 'paid' : 'unpaid'}`}>
                  <div className="bill-header">
                    <div className="bill-type">
                      <span className="type-icon">
                        {bill.type === 'electricity' && '⚡'}
                        {bill.type === 'water' && '💧'}
                        {bill.type === 'garbage' && '🗑️'}
                        {bill.type === 'management' && '🏢'}
                        {bill.type === 'parking' && '🚗'}
                        {!['electricity', 'water', 'garbage', 'management', 'parking'].includes(bill.type) && '📄'}
                      </span>
                      <span className="type-label">{getBillTypeLabel(bill.type)}</span>
                    </div>
                    <div className={`bill-status ${isPaid ? 'status-paid' : 'status-unpaid'}`}>
                      <span className="status-icon">{isPaid ? '✓' : '○'}</span>
                      <span className="status-text">{isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>
                    </div>
                  </div>

                  {bill.billItem && typeof bill.billItem === 'object' && (
                    <div className="bill-details">
                      {bill.billItem.electric > 0 && (
                        <div className="detail-item">
                          <span className="detail-label">Điện:</span>
                          <span className="detail-value">{formatCurrency(bill.billItem.electric)}</span>
                        </div>
                      )}
                      {bill.billItem.water > 0 && (
                        <div className="detail-item">
                          <span className="detail-label">Nước:</span>
                          <span className="detail-value">{formatCurrency(bill.billItem.water)}</span>
                        </div>
                      )}
                      {bill.billItem.internet > 0 && (
                        <div className="detail-item">
                          <span className="detail-label">Internet:</span>
                          <span className="detail-value">{formatCurrency(bill.billItem.internet)}</span>
                        </div>
                      )}
                      {bill.billItem.other > 0 && (
                        <div className="detail-item">
                          <span className="detail-label">Khác:</span>
                          <span className="detail-value">{formatCurrency(bill.billItem.other)}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="bill-footer">
                    <div className="bill-total">
                      <span className="total-label">Tổng cộng:</span>
                      <span className="total-amount">{formatCurrency(totalAmount)}</span>
                    </div>
                    <div className="bill-date">
                      <span className="date-label">Ngày tạo:</span>
                      <span className="date-value">{formatDate(bill.createdAt)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bills;
