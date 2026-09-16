import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/image';

const statuses = [
  'Order placed',
  'Confirmed',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
];

const money = (n) =>
  `₹${Math.round(Number(n || 0)).toLocaleString('en-IN')}`;

const Profile = () => {
  const { user, logout } = useAuth();

  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  const loadOrders = () => {
    api
      .get('/orders/my')
      .then((res) => setOrders(res.data))
      .catch(() => setError('Could not load orders.'));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCancel = async (id) => {
    try {
      await api.put(`/orders/${id}/cancel`);
      loadOrders();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Could not cancel order.'
      );
    }
  };

  // =========================================================
  // INVOICE
  // =========================================================

  const handleInvoice = (order) => {
    const orderNumber =
      order.orderNumber ||
      `#${order._id.slice(-8).toUpperCase()}`;

    const originalPrice =
      Number(order.price || 0) *
      Number(order.quantity || 1);

    const discountAmount =
      originalPrice *
      (Number(order.discount || 0) / 100);

    const itemTotal =
      originalPrice - discountAmount;

    const deliveryCharge = itemTotal >= 499 ? 0 : 49;

    const finalTotal = itemTotal + deliveryCharge;

    const invoiceWindow = window.open(
      '',
      '_blank',
      'width=900,height=800'
    );

    if (!invoiceWindow) {
      alert('Please allow pop-ups to view the invoice.');
      return;
    }

    invoiceWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>ShopEZ Invoice - ${orderNumber}</title>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 40px;
              font-family: Arial, Helvetica, sans-serif;
              background: #f5f5f8;
              color: #222;
            }

            .invoice {
              max-width: 800px;
              margin: 0 auto;
              background: #ffffff;
              padding: 45px;
              border-radius: 12px;
              box-shadow: 0 5px 25px rgba(0,0,0,0.08);
            }

            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              padding-bottom: 25px;
              border-bottom: 2px solid #eeeeee;
            }

            .brand {
              font-size: 30px;
              font-weight: 800;
              color: #4f36c5;
            }

            .brand span {
              color: #7c62e8;
            }

            .invoice-title {
              text-align: right;
            }

            .invoice-title h1 {
              margin: 0;
              font-size: 25px;
              color: #333;
            }

            .invoice-title p {
              margin: 7px 0 0;
              color: #777;
              font-size: 13px;
            }

            .details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin: 30px 0;
            }

            .detail-box h3 {
              margin: 0 0 10px;
              font-size: 14px;
              color: #555;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }

            .detail-box p {
              margin: 5px 0;
              font-size: 14px;
              line-height: 1.5;
            }

            .order-info {
              margin-bottom: 25px;
              padding: 15px;
              background: #f8f6ff;
              border-radius: 8px;
            }

            .order-info p {
              margin: 5px 0;
              font-size: 14px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }

            th {
              text-align: left;
              padding: 13px;
              background: #f4f2ff;
              color: #4f36c5;
              font-size: 13px;
            }

            td {
              padding: 15px 13px;
              border-bottom: 1px solid #eeeeee;
              font-size: 14px;
            }

            .right {
              text-align: right;
            }

            .summary {
              width: 320px;
              margin-left: auto;
              margin-top: 25px;
            }

            .summary-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              font-size: 14px;
            }

            .total {
              margin-top: 10px;
              padding-top: 15px;
              border-top: 2px solid #dddddd;
              font-size: 20px;
              font-weight: 800;
              color: #4f36c5;
            }

            .payment {
              margin-top: 30px;
              padding: 15px;
              background: #f7faf8;
              border: 1px solid #dceee2;
              border-radius: 8px;
            }

            .payment strong {
              color: #24834b;
            }

            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #eeeeee;
              text-align: center;
              color: #888;
              font-size: 12px;
              line-height: 1.6;
            }

            .print-button {
              display: block;
              margin: 25px auto 0;
              padding: 12px 28px;
              border: none;
              border-radius: 8px;
              background: #4f36c5;
              color: white;
              font-size: 14px;
              font-weight: 700;
              cursor: pointer;
            }

            @media print {
              body {
                padding: 0;
                background: white;
              }

              .invoice {
                box-shadow: none;
                max-width: none;
                border-radius: 0;
              }

              .print-button {
                display: none;
              }
            }
          </style>
        </head>

        <body>

          <div class="invoice">

            <div class="header">

              <div class="brand">
                Shop<span>EZ</span>
              </div>

              <div class="invoice-title">
                <h1>INVOICE</h1>
                <p>Order ${orderNumber}</p>
              </div>

            </div>

            <div class="details">

              <div class="detail-box">
                <h3>Customer</h3>

                <p>
                  <strong>
                    ${order.username || user?.username || 'Customer'}
                  </strong>
                </p>

                <p>
                  ${user?.email || ''}
                </p>
              </div>

              <div class="detail-box">
                <h3>Delivery Address</h3>

                <p>
                  ${order.address || 'Address not available'}
                </p>

                <p>
                  ${order.pincode || ''}
                </p>
              </div>

            </div>

            <div class="order-info">

              <p>
                <strong>Order Date:</strong>
                ${order.orderDate || 'N/A'}
              </p>

              <p>
                <strong>Order Status:</strong>
                ${order.orderStatus || 'Order placed'}
              </p>

              <p>
                <strong>Payment Method:</strong>
                ${order.paymentMethod || 'N/A'}
              </p>

              <p>
                <strong>Payment Status:</strong>
                ${order.paymentStatus || 'Pending'}
              </p>

            </div>

            <table>

              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th class="right">Price</th>
                  <th class="right">Total</th>
                </tr>
              </thead>

              <tbody>

                <tr>

                  <td>
                    <strong>
                      ${order.title || 'Product'}
                    </strong>
                  </td>

                  <td>
                    ${order.quantity || 1}
                  </td>

                  <td class="right">
                    ${money(order.price)}
                  </td>

                  <td class="right">
                    ${money(itemTotal)}
                  </td>

                </tr>

              </tbody>

            </table>

            <div class="summary">

              <div class="summary-row">
                <span>Subtotal</span>
                <strong>${money(originalPrice)}</strong>
              </div>

              <div class="summary-row">
                <span>
                  Discount (${order.discount || 0}%)
                </span>
                <strong>
                  -${money(discountAmount)}
                </strong>
              </div>

              <div class="summary-row">
                <span>Delivery</span>
                <strong>
                  ${
                    deliveryCharge === 0
                      ? 'FREE'
                      : money(deliveryCharge)
                  }
                </strong>
              </div>

              <div class="summary-row total">
                <span>Total</span>
                <strong>${money(finalTotal)}</strong>
              </div>

            </div>

            <div class="payment">

              Payment:
              <strong>
                ${order.paymentMethod || 'N/A'}
              </strong>

              &nbsp; | &nbsp;

              Status:
              <strong>
                ${order.paymentStatus || 'Pending'}
              </strong>

            </div>

            <div class="footer">

              <strong>Thank you for shopping with ShopEZ!</strong>

              <br />

              This is a computer-generated invoice for
              your ShopEZ college project application.

            </div>

            <button
              class="print-button"
              onclick="window.print()"
            >
              Download / Print Invoice
            </button>

          </div>

        </body>
      </html>
    `);

    invoiceWindow.document.close();
  };

  return (
    <div className="profile-page enhanced-profile">

      {/* =====================================================
          PROFILE SIDEBAR
          ===================================================== */}

      <aside className="profile-sidebar profile-card">

        <div className="profile-avatar">
          {user?.username?.[0]?.toUpperCase() || 'U'}
        </div>

        <h2>{user?.username}</h2>

        <p>{user?.email}</p>

        <div className="profile-stat">
          <strong>{orders.length}</strong>
          <span>Orders</span>
        </div>

        <button
          className="secondary-btn"
          onClick={logout}
        >
          Logout
        </button>

      </aside>

      {/* =====================================================
          ORDERS
          ===================================================== */}

      <main className="orders-list">

        <div className="section-heading-row">

          <div>
            <h2>My Orders</h2>

            <p className="muted">
              Track your recent ShopEZ purchases.
            </p>
          </div>

        </div>

        {error && (
          <p className="error-text">
            {error}
          </p>
        )}

        {!orders.length && (
          <div className="empty-state">

            <h3>No orders yet</h3>

            <p>
              Your placed orders will appear here.
            </p>

          </div>
        )}

        {orders.map((o) => {

          const current = statuses.indexOf(
            o.orderStatus
          );

          const cancelled =
            o.orderStatus === 'Cancelled';

          return (
            <div
              className="order-card enhanced-order-card"
              key={o._id}
            >

              {/* ================================
                  ORDER HEADER
                  ================================= */}

              <div className="order-card-top">

                <div>

                  <span className="order-number">
                    Order{' '}
                    {o.orderNumber ||
                      `#${o._id
                        .slice(-8)
                        .toUpperCase()}`}
                  </span>

                  <span className="muted">
                    {' '}
                    · {o.orderDate}
                  </span>

                </div>

                <span
                  className={`status-pill ${
                    cancelled
                      ? 'cancelled'
                      : 'active-status'
                  }`}
                >
                  {o.orderStatus}
                </span>

              </div>

              {/* ================================
                  PRODUCT
                  ================================= */}

              <div className="order-product-row">

                <img
                  src={getImageUrl(o.mainImg)}
                  alt={o.title}
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://placehold.co/100?text=EZ';
                  }}
                />

                <div className="order-info">

                  <h4>{o.title}</h4>

                  <p>
                    Qty: {o.quantity}

                    {o.size
                      ? ` · Size: ${o.size}`
                      : ''}

                    {' · '}

                    {money(
                      o.totalAmount ||
                        o.price *
                          o.quantity *
                          (1 -
                            (o.discount || 0) /
                              100)
                    )}
                  </p>

                  <p>
                    Payment:{' '}
                    {o.paymentMethod}

                    {' · '}

                    {o.paymentStatus ||
                      'Pending'}
                  </p>

                  <p>
                    Deliver to:{' '}
                    {o.address},{' '}
                    {o.pincode}
                  </p>

                </div>

              </div>

              {/* ================================
                  TRACKING
                  ================================= */}

              {!cancelled && (
                <div className="tracking-line">

                  {statuses.map((s, i) => (

                    <div
                      className={`tracking-step ${
                        i <= current
                          ? 'done'
                          : ''
                      }`}
                      key={s}
                    >

                      <span>
                        {i <= current
                          ? '✓'
                          : i + 1}
                      </span>

                      <small>
                        {s}
                      </small>

                    </div>

                  ))}

                </div>
              )}

              {/* ================================
                  ORDER ACTIONS
                  ================================= */}

              <div className="order-actions">

                {!cancelled &&
                  ![
                    'Delivered',
                    'Shipped',
                  ].includes(
                    o.orderStatus
                  ) && (

                    <button
                      className="cancel-btn"
                      onClick={() =>
                        handleCancel(o._id)
                      }
                    >
                      Cancel Order
                    </button>

                  )}

                {/* Invoice */}

                <button
                  className="invoice-btn"
                  onClick={() =>
                    handleInvoice(o)
                  }
                >
                  🧾 View / Download Invoice
                </button>

                {o.deliveryDate &&
                  !cancelled && (

                    <span className="delivery-estimate">
                      Expected delivery:{' '}
                      <strong>
                        {o.deliveryDate}
                      </strong>
                    </span>

                  )}

              </div>

            </div>
          );
        })}

      </main>
    </div>
  );
};

export default Profile;