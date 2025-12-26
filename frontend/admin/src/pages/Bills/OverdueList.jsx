    import React, { useEffect, useMemo, useState } from 'react'
    import Backbutton from '../../components/Backbutton/Backbutton'
    import './Bills.css'

    const STORAGE_KEY = 'admin_bills'

    const OverdueList = () => {
      const [bills, setBills] = useState([])

      useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return setBills([])
        try {
          setBills(JSON.parse(raw))
        } catch (e) {
          setBills([])
        }
      }, [])

      useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bills))
      }, [bills])

      const todayStart = useMemo(() => {
        const d = new Date()
        d.setHours(0, 0, 0, 0)
        return d
      }, [])

      const overdue = bills.filter((b) => {
        const paid = b.status && String(b.status).toLowerCase() === 'paid'
        if (paid) return false
        if (!b.dueDate) return false
        try {
          const due = new Date(b.dueDate)
          return due < todayStart
        } catch (e) {
          return false
        }
      })

      const markPaid = (id) => {
        if (!confirm('Đánh dấu hóa đơn là đã thanh toán?')) return
        setBills((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'Paid' } : b)))
      }

      return (
        <div className="admin-main-content">
          <Backbutton />
          <h2>Hóa đơn quá hạn</h2>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Tên hộ</th>
                <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Tháng</th>
                <th style={{ borderBottom: '1px solid #ddd', textAlign: 'right', padding: 8 }}>Số tiền</th>
                <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Hạn đóng</th>
                <th style={{ borderBottom: '1px solid #ddd', padding: 8 }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {overdue.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: 12 }}>Không có hóa đơn quá hạn</td>
                </tr>
              )}
              {overdue.map((b) => (
                <tr key={b.id}>
                  <td style={{ padding: 8, color: '#b91c1c', fontWeight: 700 }}>{b.household}</td>
                  <td style={{ padding: 8 }}>{b.month}</td>
                  <td style={{ padding: 8, textAlign: 'right' }}>{Number(b.amount).toLocaleString('vi-VN')} ₫</td>
                  <td style={{ padding: 8 }}>{b.dueDate}</td>
                  <td style={{ padding: 8 }}>
                    <button onClick={() => markPaid(b.id)}>Đã thanh toán</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    export default OverdueList
    