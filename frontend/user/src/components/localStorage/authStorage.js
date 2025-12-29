// authStorage - Lưu trữ thông tin authentication trong sessionStorage
// Dữ liệu sẽ tự động xóa khi đóng tab/trình duyệt

const AUTH_KEY = 'auth_identification';

/**
 * Lưu identification vào sessionStorage
 * @param {string} identification - CCCD/CMND của user
 */
export const saveIdentification = (identification) => {
  try {
    sessionStorage.setItem(AUTH_KEY, identification);
    return true;
  } catch (error) {
    console.error('Error saving identification:', error);
    return false;
  }
};

/**
 * Lấy identification từ sessionStorage
 * @returns {string|null} - Identification hoặc null nếu không tồn tại
 */
export const getIdentification = () => {
  try {
    return sessionStorage.getItem(AUTH_KEY);
  } catch (error) {
    console.error('Error getting identification:', error);
    return null;
  }
};

/**
 * Xóa identification khỏi sessionStorage
 */
export const clearIdentification = () => {
  try {
    sessionStorage.removeItem(AUTH_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing identification:', error);
    return false;
  }
};

/**
 * Kiểm tra xem user đã đăng nhập chưa
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return getIdentification() !== null;
};


