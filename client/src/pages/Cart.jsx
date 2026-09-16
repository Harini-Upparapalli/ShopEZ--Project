import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { getImageUrl } from '../utils/image';

const money = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;

const Cart = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState('');
  const navigate = useNavigate();

  const loadCart = async () => {
    try { setItems((await api.get('/cart')).data); setError(''); }
    catch { setError('Could not load cart.'); }
  };
  useEffect(() => { loadCart(); }, []);

  const updateQty = async (item, quantity) => {
    if (quantity < 1) return;
    setUpdating(item._id); setError('');
    try { await api.put(`/cart/${item._id}`, { quantity }); await loadCart(); }
    catch (err) { setError(err.response?.data?.message || 'Could not update quantity.'); }
    finally { setUpdating(''); }
  };

  const handleRemove = async (id) => {
    try { await api.delete(`/cart/${id}`); await loadCart(); }
    catch { setError('Could not remove item.'); }
  };

  const totalMRP = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discountAmount = items.reduce((sum, i) => sum + (i.price * i.quantity * (i.discount || 0)) / 100, 0);
  const deliveryCharges = totalMRP - discountAmount >= 499 ? 0 : 49;
  const finalPrice = Math.round(totalMRP - discountAmount + deliveryCharges);

  return (
    <div className="cart-page real-cart-page">
      <div className="cart-items">
        <div className="section-heading-row"><h2>Your Cart</h2><span>{items.length} item(s)</span></div>
        {error && <p className="error-text">{error}</p>}
        {items.length === 0 && <div className="empty-state"><h3>Your cart is empty</h3><p>Add products you love and they will appear here.</p><button className="shop-now-btn" onClick={() => navigate('/products')}>Continue Shopping</button></div>}
        {items.map((item) => (
          <div className="cart-item enhanced-cart-item" key={item._id}>
            <img src={getImageUrl(item.mainImg)} alt={item.title} onError={(e) => { e.currentTarget.src = 'https://placehold.co/120x120?text=ShopEZ'; }} />
            <div className="cart-item-main">
              <h4>{item.title}</h4>
              {item.size && <p className="muted">Size: {item.size}</p>}
              <p className="stock-text">{item.stock > 0 ? `${item.stock} available` : 'Out of stock'}</p>
              <div className="cart-price-row"><strong>{money(item.price * (1 - (item.discount || 0) / 100))}</strong>{item.discount > 0 && <del>{money(item.price)}</del>}</div>
              <div className="cart-controls">
                <div className="qty-control">
                  <button disabled={updating === item._id || item.quantity <= 1} onClick={() => updateQty(item, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button disabled={updating === item._id || item.quantity >= item.stock} onClick={() => updateQty(item, item.quantity + 1)}>+</button>
                </div>
                <button className="text-action" onClick={() => handleRemove(item._id)}>Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {items.length > 0 && (
        <div className="price-details sticky-price-card">
          <h3>Price Details</h3>
          <p>Total MRP: <span>{money(totalMRP)}</span></p>
          <p>Discount on MRP: <span className="saving-text">− {money(discountAmount)}</span></p>
          <p>Delivery Charges: <span>{deliveryCharges ? money(deliveryCharges) : 'FREE'}</span></p>
          <hr />
          <p className="final-price">Total Amount: <span>{money(finalPrice)}</span></p>
          <p className="free-delivery-note">Free delivery on orders above ₹499</p>
          <button className="shop-now-btn full-width" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
};
export default Cart;
