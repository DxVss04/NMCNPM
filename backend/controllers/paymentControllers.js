// controllers/payment.controller.js
import { vnpay } from "../config/vnpay.js";
import Bill from "../models/bill.js";
import HouseHold from "../models/houseHoldModel.js";
import Transaction from "../models/Transaction.js";

// ============================================
// 1. API TẠO URL THANH TOÁN (Client gọi)
// ============================================
export const createPayment = async (req, res) => {
  try {
    const { billId, houseHoldId, billItemIndex } = req.body;

    // Kiểm tra bill & household
    const bill = await Bill.findById(billId);
    const houseHold = await HouseHold.findById(houseHoldId);

    if (!bill || !houseHold) {
      return res.status(404).json({
        message: "Bill or household not found",
      });
    }

    // Kiểm tra billItem
    const item = bill.billItem[billItemIndex];
    if (!item) {
      return res.status(400).json({
        message: "Invalid billItem index",
      });
    }

    if (item.status === true) {
      return res.status(400).json({
        message: "This bill item has already been paid",
      });
    }

    // Tạo mã giao dịch unique
    const txnRef = `${billId}_${billItemIndex}_${Date.now()}`;

    // Tạo payment URL
    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: vnpay.tmnCode,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: `Thanh toan hoa don ${bill.name || billId}`,
      vnp_OrderType: "billpayment",
      vnp_Amount: item.amount,
      vnp_ReturnUrl: `${process.env.BASE_URL}/api/payment/vnpay-return`,
      vnp_IpAddr: req.ip || req.connection.remoteAddress,
      vnp_CreateDate: new Date(),
      vnp_BankCode: "VNPAYQR", // Hiển thị QR code
    });

    res.status(200).json({
      success: true,
      paymentUrl,
      txnRef,
    });
  } catch (error) {
    console.error("Create payment error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ============================================
// 2. API IPN (VNPay gọi - webhook)
// ============================================
export const vnpayIPN = async (req, res) => {
  try {
    // Verify signature từ VNPay
    const verify = vnpay.verifyReturnUrl(req.query);

    if (!verify.isVerified) {
      return res.status(200).json({
        RspCode: "97",
        Message: "Invalid signature",
      });
    }

    // Parse thông tin từ txnRef
    const txnRef = verify.vnp_TxnRef;
    const [billId, billItemIndex] = txnRef.split("_");

    // Kiểm tra giao dịch đã được xử lý chưa
    const existingTransaction = await Transaction.findOne({
      txnRef: txnRef,
    });

    if (existingTransaction) {
      return res.status(200).json({
        RspCode: "02",
        Message: "Transaction already processed",
      });
    }

    // Kiểm tra kết quả thanh toán
    if (
      verify.vnp_ResponseCode !== "00" ||
      verify.vnp_TransactionStatus !== "00"
    ) {
      return res.status(200).json({
        RspCode: "00",
        Message: "Payment failed but confirmed",
      });
    }

    // Lấy thông tin bill
    const bill = await Bill.findById(billId);
    if (!bill) {
      return res.status(200).json({
        RspCode: "01",
        Message: "Bill not found",
      });
    }

    const item = bill.billItem[billItemIndex];
    if (!item) {
      return res.status(200).json({
        RspCode: "01",
        Message: "Bill item not found",
      });
    }

    // Kiểm tra số tiền
    const amountPaid = verify.vnp_Amount / 100;
    if (amountPaid < item.amount) {
      return res.status(200).json({
        RspCode: "04",
        Message: "Invalid amount",
      });
    }

    // Tạo transaction
    const transaction = new Transaction({
      bill: billId,
      houseHold: bill.houseHold,
      billItemIndex: parseInt(billItemIndex),
      amountPaid: amountPaid,
      method: "vnpay",
      txnRef: txnRef,
      vnpayTransactionNo: verify.vnp_TransactionNo,
      bankCode: verify.vnp_BankCode,
      cardType: verify.vnp_CardType,
      payDate: verify.vnp_PayDate,
    });

    await transaction.save();

    // Cập nhật billItem
    item.status = true;
    item.paidAt = new Date();
    await bill.save();

    // Phản hồi thành công cho VNPay
    return res.status(200).json({
      RspCode: "00",
      Message: "Confirm Success",
    });
  } catch (error) {
    console.error("VNPay IPN error:", error);
    return res.status(200).json({
      RspCode: "99",
      Message: "System error",
    });
  }
};

// ============================================
// 3. API RETURN URL (Redirect sau thanh toán)
// ============================================
export const vnpayReturn = async (req, res) => {
  try {
    // Verify signature
    const verify = vnpay.verifyReturnUrl(req.query);

    if (!verify.isVerified) {
      return res.redirect(
        `${process.env.CLIENT_URL}/payment/error?message=invalid_signature`
      );
    }

    // Parse thông tin
    const txnRef = verify.vnp_TxnRef;
    const [billId, billItemIndex] = txnRef.split("_");

    // Kiểm tra kết quả
    if (
      verify.vnp_ResponseCode === "00" &&
      verify.vnp_TransactionStatus === "00"
    ) {
      // Thanh toán thành công
      return res.redirect(
        `${process.env.CLIENT_URL}/payment/success?billId=${billId}&amount=${
          verify.vnp_Amount / 100
        }&txnRef=${txnRef}`
      );
    } else {
      // Thanh toán thất bại
      const errorMessage = getErrorMessage(verify.vnp_ResponseCode);
      return res.redirect(
        `${process.env.CLIENT_URL}/payment/failed?message=${errorMessage}&code=${verify.vnp_ResponseCode}`
      );
    }
  } catch (error) {
    console.error("VNPay Return error:", error);
    return res.redirect(
      `${process.env.CLIENT_URL}/payment/error?message=system_error`
    );
  }
};

// ============================================
// 4. HELPER FUNCTION (cùng file)
// ============================================
function getErrorMessage(code) {
  const errors = {
    "07": "Giao dịch bị nghi ngờ gian lận",
    "09": "Thẻ chưa đăng ký Internet Banking",
    10: "Xác thực thông tin không đúng quá 3 lần",
    11: "Hết hạn chờ thanh toán",
    12: "Thẻ bị khóa",
    13: "Sai mật khẩu OTP",
    24: "Khách hàng hủy giao dịch",
    51: "Tài khoản không đủ số dư",
    65: "Vượt quá hạn mức giao dịch",
    75: "Ngân hàng đang bảo trì",
    79: "Nhập sai mật khẩu quá số lần",
    99: "Lỗi không xác định",
  };
  return errors[code] || "Giao dịch thất bại";
}
