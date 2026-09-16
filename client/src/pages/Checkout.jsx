import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/image';

const money = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const blankAddress = { label: 'Home', name: '', mobile: '', addressLine: '', city: '', state: 'Andhra Pradesh', pincode: '' };

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [newAddress, setNewAddress] = useState(blankAddress);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [success, setSuccess] = useState(null);

  const load = async () => {
    try {
      const [cartRes, addressRes] = await Promise.all([api.get('/cart'), api.get('/addresses')]);
      setItems(cartRes.data); setAddresses(addressRes.data);
      if (addressRes.data.length) setSelectedAddress(addressRes.data[0]._id);
      else setShowAddressForm(true);
    } catch { setError('Could not load checkout details.'); }
  };
  useEffect(() => { load(); }, []);

  const selected = addresses.find((a) => a._id === selectedAddress);
  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items]);
  const discount = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity * (i.discount || 0) / 100, 0), [items]);
  const delivery = subtotal - discount >= 499 ? 0 : 49;
  const total = Math.round(subtotal - discount + delivery);

  const handleAddressChange = (e) => setNewAddress({ ...newAddress, [e.target.name]: e.target.value });

  const saveAddress = async (e) => {
    e.preventDefault(); setSavingAddress(true); setError('');
    try {
      const { data } = await api.post('/addresses', newAddress);
      setAddresses((prev) => [data, ...prev]); setSelectedAddress(data._id); setShowAddressForm(false); setNewAddress(blankAddress);
    } catch (err) { setError(err.response?.data?.message || 'Could not save address.'); }
    finally { setSavingAddress(false); }
  };

  const placeOrder = async (e) => {
    e.preventDefault(); setError('');
    if (!selected) { setError('Please select or add a delivery address.'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/orders/checkout', {
        name: selected.name, email: user.email, mobile: selected.mobile,
        address: `${selected.addressLine}, ${selected.city}, ${selected.state}`,
        pincode: selected.pincode, paymentMethod,
      });
      setSuccess(data);
    } catch (err) { setError(err.response?.data?.message || 'Failed to place order.'); }
    finally { setLoading(false); }
  };

  if (success) return (
    <div className="checkout-page success-checkout">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h1>Order Placed Successfully!</h1>
        <p>Your ShopEZ order has been confirmed.</p>
        <p><strong>Order ID:</strong> {success.orderNumber}</p>
        <p><strong>Payment:</strong> {success.paymentStatus}</p>
        <div className="checkout-success-actions"><button className="shop-now-btn" onClick={() => navigate('/profile')}>Track My Order</button><button className="secondary-btn" onClick={() => navigate('/products')}>Continue Shopping</button></div>
      </div>
    </div>
  );

  if (!items.length) return <div className="empty-state page-empty"><h3>Your cart is empty</h3><button className="shop-now-btn" onClick={() => navigate('/products')}>Shop Now</button></div>;

  return (
    <div className="checkout-page">
      <div className="checkout-main">
        <div className="checkout-card">
          <div className="checkout-title"><span>1</span><div><h2>Delivery Address</h2><p>Select where you want your order delivered.</p></div></div>
          {addresses.length > 0 && <div className="address-grid">{addresses.map((a) => (
            <label className={`address-card ${selectedAddress === a._id ? 'selected' : ''}`} key={a._id}>
              <input type="radio" checked={selectedAddress === a._id} onChange={() => setSelectedAddress(a._id)} />
              <div className="address-card-content"><strong>{a.label}</strong><p>{a.name} · {a.mobile}</p><p>{a.addressLine}, {a.city}, {a.state} - {a.pincode}</p><button type="button" className="link-btn address-delete" onClick={async (e) => { e.preventDefault(); try { await api.delete(`/addresses/${a._id}`); const next = addresses.filter((x) => x._id !== a._id); setAddresses(next); setSelectedAddress(next[0]?._id || ''); } catch (err) { setError(err.response?.data?.message || 'Could not delete address.'); } }}>Delete</button></div>
            </label>
          ))}</div>}
          <button type="button" className="link-btn" onClick={() => setShowAddressForm(!showAddressForm)}>{showAddressForm ? 'Hide address form' : '+ Add New Address'}</button>
          {showAddressForm && <form className="address-form-grid" onSubmit={saveAddress}>
            {Object.keys(blankAddress).map((key) => <input key={key} name={key} placeholder={key === 'addressLine' ? 'House / Street / Area' : key[0].toUpperCase() + key.slice(1)} value={newAddress[key]} onChange={handleAddressChange} required={key !== 'label'} />)}
            <button className="secondary-btn" disabled={savingAddress}>{savingAddress ? 'Saving...' : 'Save Address'}</button>
          </form>}
        </div>

        <div className="checkout-card">
          <div className="checkout-title"><span>2</span><div><h2>Payment Method</h2><p>Choose how you want to pay.</p></div></div>
          <div className="payment-options">
            {[['COD','Cash on Delivery','Pay when your order arrives'],['UPI','UPI','Demo payment — no real money is charged'],['card','Credit / Debit Card','Demo payment — no real money is charged'],['netbanking','Net Banking','Demo payment — no real money is charged']].map(([value,title,desc]) => <label className={`payment-option ${paymentMethod === value ? 'selected' : ''}`} key={value}><input type="radio" value={value} checked={paymentMethod === value} onChange={(e) => setPaymentMethod(e.target.value)} /><div><strong>{title}</strong><small>{desc}</small></div></label>)}
          </div>
          {paymentMethod !== 'COD' && <p className="demo-payment-note">🔒 This college-project demo simulates successful online payment. No real payment gateway or money transfer is used.</p>}
        </div>
      </div>

      <aside className="checkout-summary">
        <h2>Order Summary</h2>
        <div className="checkout-products">{items.map((item) => <div className="checkout-product" key={item._id}><img src={getImageUrl(item.mainImg)} alt="" onError={(e) => { e.currentTarget.src = 'https://placehold.co/60?text=EZ'; }} /><div><strong>{item.title}</strong><span>Qty: {item.quantity}</span></div><b>{money(item.price * item.quantity * (1 - (item.discount || 0) / 100))}</b></div>)}</div>
        <hr /><p>Subtotal <span>{money(subtotal)}</span></p><p>Discount <span className="saving-text">− {money(discount)}</span></p><p>Delivery <span>{delivery ? money(delivery) : 'FREE'}</span></p><hr /><h3>Total <span>{money(total)}</span></h3>
        {error && <p className="error-text">{error}</p>}
        <button className="shop-now-btn full-width" onClick={placeOrder} disabled={loading || !selected}>{loading ? 'Processing Order...' : paymentMethod === 'COD' ? 'Place Order' : 'Pay & Place Order'}</button>
      </aside>
    </div>
  );
};
export default Checkout;
