import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Backbutton from '../../components/Backbutton/Backbutton'
import './Bills.css'

const STORAGE_KEY = 'admin_bills'

const BillForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [household, setHousehold] = useState('')
  const [month, setMonth] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [status, setStatus] = useState('Unpaid')

  useEffect(() => {
    if (!id) return
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    try {
      const arr = JSON.parse(raw)
      const bill = arr.find((b) => String(b.id) === String(id))
      if (!bill) return
      setHousehold(bill.household || '')
      setMonth(bill.month || '')
      setAmount(bill.amount != null ? String(bill.amount) : '')
      setDueDate(bill.dueDate || '')
      setStatus(bill.status || 'Unpaid')
    } catch (e) {
      // ignore
    }
  }, [id])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!household || !month || !amount || !dueDate) {
      alert('Vui lòng điền đầy đủ thông tin')
      return
    }

    const raw = localStorage.getItem(STORAGE_KEY)
    const arr = raw ? JSON.parse(raw) : []

    if (id) {
      const updated = arr.map((b) => {
        if (String(b.id) === String(id)) {
          return {
            ...b,
            household,
            month,
            amount: Number(amount),
            dueDate,
            status
          }
        }
        return b
      })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } else {
      const nextId = arr.length ? Math.max(...arr.map((x) => Number(x.id))) + 1 : 1
      const newBill = {
        id: nextId,
        household,
        month,
        amount: Number(amount),
        dueDate,
        status: status || 'Unpaid'
      }
      arr.push(newBill)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr))
    }

    navigate('/bills')
  }

  return (
    <div className="admin-main-content">
      <Backbutton />
      <h2>{id ? 'Sửa hóa đơn' : 'Thêm hóa đơn'}</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
        <div style={{ marginBottom: 8 }}>
          <label> Tên hộ<br />
            <input value={household} onChange={(e) => setHousehold(e.target.value)} style={{ width: '100%' }} />
          </label>
        </div>

        <div style={{ marginBottom: 8 }}>
          <label> Tháng<br />
            <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} style={{ width: '100%' }} />
          </label>
        </div>

        <div style={{ marginBottom: 8 }}>
          <label> Số tiền<br />
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: '100%' }} />
          </label>
        </div>

        <div style={{ marginBottom: 8 }}>
          <label> Hạn đóng<br />
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={{ width: '100%' }} />
          </label>
        </div>

        <div style={{ marginTop: 12 }}>
          <button type="submit" style={{ marginRight: 8 }}>{id ? 'Lưu' : 'Thêm'}</button>
          <button type="button" onClick={() => navigate('/bills')}>Hủy</button>
        </div>
      </form>
    </div>
  )
}

export default BillForm
