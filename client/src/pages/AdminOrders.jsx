import { useEffect, useState } from 'react';
import api from '../api/axios';

const statusOptions = ['Order placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]); const [error, setError] = useState('');
  const load = () => api.get('/orders').then((res) => setOrders(res.data)).catch(() => setError('Could not load orders.'));
  useEffect(() => { load(); }, []);
  const changeStatus = async (id, orderStatus) => { try { await api.put(`/orders/${id}/status`, { orderStatus }); setOrders((prev) => prev.map((o) => o._id === id ? { ...o, orderStatus } : o)); } catch (err) { setError(err.response?.data?.message || 'Could not update status.'); } };
  return <div className="admin-list-page"><div className="admin-list-header"><div><h2>Order Management</h2><p className="muted">Update delivery status and monitor customer purchases.</p></div><span className="admin-count">{orders.length} orders</span></div>{error && <p className="error-text">{error}</p>}<div className="admin-orders-grid">{orders.map((o) => <div className="admin-order-card" key={o._id}><div className="admin-order-top"><strong>{o.orderNumber || `#${o._id.slice(-8).toUpperCase()}`}</strong><span>{o.orderDate}</span></div><h3>{o.title}</h3><p>{o.name} · {o.email}</p><p>Qty: {o.quantity} · ₹{Math.round(o.totalAmount || o.price * o.quantity * (1 - (o.discount || 0)/100)).toLocaleString('en-IN')}</p><p>Payment: {o.paymentMethod} · {o.paymentStatus || 'Pending'}</p><select value={o.orderStatus} onChange={(e) => changeStatus(o._id, e.target.value)}>{statusOptions.map((s) => <option key={s}>{s}</option>)}</select></div>)}</div></div>;
};
export default AdminOrders;
