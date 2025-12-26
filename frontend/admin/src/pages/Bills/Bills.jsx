import React, { useEffect, useMemo, useState } from 'react'
import './Bills.css'
import { Link, useNavigate } from 'react-router-dom'
import Backbutton from '../../components/Backbutton/Backbutton'

const STORAGE_KEY = 'admin_bills'

const sampleData = [
  {
    id: 1,
    household: 'Nguyen Van A',
    month: '2025-12',
    amount: 450000,
    dueDate: '2025-12-25',
    status: 'Unpaid'
  },
  {
    id: 2,
    household: 'Tran Thi B',
    month: '2025-12',
    amount: 300000,
    dueDate: '2025-12-20',
    status: 'Paid'
  }
]

const formatCurrency = (v) =>
  v.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })

const Bills = () => {
  const navigate = useNavigate()
  const [bills, setBills] = useState([])
  const [houseFilter, setHouseFilter] = useState('All')
  const [monthFilter, setMonthFilter] = useState('All')

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        setBills(JSON.parse(raw))
      } catch (e) {
        setBills(sampleData)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleData))
      }
    } else {
      setBills(sampleData)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleData))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bills))
  }, [bills])

  const households = useMemo(() => {
    const setH = new Set(bills.map((b) => b.household))
    return ['All', ...Array.from(setH)]
  }, [bills])

  const months = useMemo(() => {
    const setM = new Set(bills.map((b) => b.month))
    return ['All', ...Array.from(setM).sort().reverse()]
  }, [bills])

  const filtered = bills.filter((b) => {
    if (houseFilter !== 'All' && b.household !== houseFilter) return false
    if (monthFilter !== 'All' && b.month !== monthFilter) return false
    return true
  })

  const handleDelete = (id) => {
    const bill = bills.find((x) => x.id === id)
    if (!bill) return
    if (bill.status && bill.status.toLowerCase() !== 'unpaid') {
      alert('Chỉ có thể xóa hóa đơn chưa đóng')
      return
    }
    if (!confirm('Xác nhận xóa hóa đơn này?')) return
    setBills((prev) => prev.filter((x) => x.id !== id))
  }

  return (
    <div className="admin-main-content">
      <Backbutton />
      <h2>Danh sách hóa đơn</h2>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <label>
          Hộ:
          <select value={houseFilter} onChange={(e) => setHouseFilter(e.target.value)} style={{ marginLeft: 6 }}>
            {households.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </label>

        <label>
          Tháng:
          <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} style={{ marginLeft: 6 }}>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>

        <div style={{ marginLeft: 'auto' }}>
          <button onClick={() => navigate('/bills/add')} style={{ marginRight: 8 }}>Thêm</button>
          <Link to="/bills/add">Thêm (Link)</Link>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Tên hộ</th>
            <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Tháng</th>
            <th style={{ borderBottom: '1px solid #ddd', textAlign: 'right', padding: 8 }}>Số tiền</th>
            <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Hạn đóng</th>
            <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Trạng thái</th>
            <th style={{ borderBottom: '1px solid #ddd', padding: 8 }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 && (
            <tr>
              <td colSpan={6} style={{ padding: 12 }}>
                Không có hóa đơn
              </td>
            </tr>
          )}
          {filtered.map((b) => (
            <tr key={b.id}>
              <td style={{ padding: 8 }}>{b.household}</td>
              <td style={{ padding: 8 }}>{b.month}</td>
              <td style={{ padding: 8, textAlign: 'right' }}>{formatCurrency(b.amount)}</td>
              <td style={{ padding: 8 }}>{b.dueDate}</td>
              <td style={{ padding: 8 }}>{b.status}</td>
              <td style={{ padding: 8 }}>
                <Link to={`/bills/edit/${b.id}`} style={{ marginRight: 8 }}>Sửa</Link>
                <button onClick={() => handleDelete(b.id)} disabled={b.status && b.status.toLowerCase() !== 'unpaid'}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Bills
