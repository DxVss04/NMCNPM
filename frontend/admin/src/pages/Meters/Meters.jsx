import React, { useEffect, useMemo, useState } from 'react'
import Backbutton from '../../components/Backbutton/Backbutton'
import './Meters.css'
import { useNavigate } from 'react-router-dom'
import residentsData from '../Residents/data.json'

const METERS_KEY = 'admin_meters'
const BILLS_KEY = 'admin_bills'

const formatNumber = (v) => (v == null || v === '') ? '' : Number(v)

const Meters = () => {
  const navigate = useNavigate()
  const [meters, setMeters] = useState([])

  useEffect(() => {
    const raw = localStorage.getItem(METERS_KEY)
    if (raw) {
      try {
        setMeters(JSON.parse(raw))
        return
      } catch (e) {}
    }

    // seed from bills households or residents
    const billsRaw = localStorage.getItem(BILLS_KEY)
    let households = []
    if (billsRaw) {
      try {
        const arr = JSON.parse(billsRaw)
        households = Array.from(new Set(arr.map((b) => b.household)))
      } catch (e) {}
    }
    if (households.length === 0 && Array.isArray(residentsData)) {
      households = residentsData.map((r) => r.namehead || r.namehousehold)
    }

    const seed = households.map((h, idx) => ({
      id: idx + 1,
      household: h,
      oldElec: 0,
      newElec: '',
      oldWater: 0,
      newWater: '',
      updatedAt: null
    }))
    setMeters(seed)
    localStorage.setItem(METERS_KEY, JSON.stringify(seed))
  }, [])

  useEffect(() => {
    localStorage.setItem(METERS_KEY, JSON.stringify(meters))
  }, [meters])

  const handleChange = (id, field, value) => {
    setMeters((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)))
  }

  const consumption = (oldV, newV) => {
    const oldN = Number(oldV) || 0
    const newN = Number(newV)
    if (isNaN(newN)) return ''
    return Math.max(0, newN - oldN)
  }

  const saveReading = (id) => {
    setMeters((prev) => prev.map((m) => (m.id === id ? { ...m, oldElec: Number(m.newElec) || m.oldElec, oldWater: Number(m.newWater) || m.oldWater, newElec: '', newWater: '', updatedAt: new Date().toISOString() } : m)))
    alert('Đã lưu chỉ số')
  }

  const createBillFrom = (meter) => {
    const elecCons = consumption(meter.oldElec, meter.newElec)
    const waterCons = consumption(meter.oldWater, meter.newWater)

    // Simple local calculation as placeholder (backend should calculate properly)
    const elecRate = 2000 // VND per kWh (example)
    const waterRate = 5000 // VND per m3 (example)
    const amount = (Number(elecCons) * elecRate) + (Number(waterCons) * waterRate)

    const raw = localStorage.getItem(BILLS_KEY)
    const arr = raw ? JSON.parse(raw) : []
    const nextId = arr.length ? Math.max(...arr.map((x) => Number(x.id))) + 1 : 1
    const bill = {
      id: nextId,
      household: meter.household,
      month: new Date().toISOString().slice(0,7),
      amount,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().slice(0,10),
      status: 'Unpaid',
      meta: { elecCons, waterCons }
    }
    arr.push(bill)
    localStorage.setItem(BILLS_KEY, JSON.stringify(arr))
    alert('Đã tạo hóa đơn — chuyển tới trang danh sách hóa đơn')
    navigate('/bills')
  }

  return (
    <div className="admin-main-content">
      <Backbutton />
      <h2>Nhập chỉ số điện nước</h2>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Tên hộ</th>
            <th style={{ borderBottom: '1px solid #ddd', textAlign: 'right', padding: 8 }}>Đ. điện cũ</th>
            <th style={{ borderBottom: '1px solid #ddd', textAlign: 'right', padding: 8 }}>Đ. điện mới</th>
            <th style={{ borderBottom: '1px solid #ddd', textAlign: 'right', padding: 8 }}>Tiêu thụ (kWh)</th>
            <th style={{ borderBottom: '1px solid #ddd', textAlign: 'right', padding: 8 }}>Nước cũ</th>
            <th style={{ borderBottom: '1px solid #ddd', textAlign: 'right', padding: 8 }}>Nước mới</th>
            <th style={{ borderBottom: '1px solid #ddd', textAlign: 'right', padding: 8 }}>Tiêu thụ (m3)</th>
            <th style={{ borderBottom: '1px solid #ddd', padding: 8 }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {meters.map((m) => (
            <tr key={m.id}>
              <td style={{ padding: 8 }}>{m.household}</td>
              <td style={{ padding: 8, textAlign: 'right' }}>{m.oldElec}</td>
              <td style={{ padding: 8, textAlign: 'right' }}>
                <input style={{ width: 100, textAlign: 'right' }} value={m.newElec} onChange={(e) => handleChange(m.id, 'newElec', e.target.value)} />
              </td>
              <td style={{ padding: 8, textAlign: 'right' }}>{consumption(m.oldElec, m.newElec)}</td>
              <td style={{ padding: 8, textAlign: 'right' }}>{m.oldWater}</td>
              <td style={{ padding: 8, textAlign: 'right' }}>
                <input style={{ width: 100, textAlign: 'right' }} value={m.newWater} onChange={(e) => handleChange(m.id, 'newWater', e.target.value)} />
              </td>
              <td style={{ padding: 8, textAlign: 'right' }}>{consumption(m.oldWater, m.newWater)}</td>
              <td style={{ padding: 8 }}>
                <button onClick={() => saveReading(m.id)} style={{ marginRight: 8 }}>Lưu chỉ số</button>
                <button onClick={() => createBillFrom(m)}>Tạo hóa đơn</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Meters
