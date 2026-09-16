import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const money = (value) =>
  `₹${Math.round(Number(value || 0)).toLocaleString('en-IN')}`;

const statusList = [
  'Order placed',
  'Confirmed',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    allProducts: 0,
    allOrders: 0,
    totalRevenue: 0,
    orderStatus: {},
    recentOrders: [],
    categorySales: [],
    inventory: {
      outOfStockCount: 0,
      lowStockCount: 0,
      outOfStockProducts: [],
      lowStockProducts: [],
    },
  });

  const [banner, setBanner] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError('');

        const [dashboardResponse, settingsResponse] =
          await Promise.all([
            api.get('/admin/dashboard'),
            api.get('/admin/settings'),
          ]);

        const data = dashboardResponse.data || {};

        setStats({
          totalUsers: data.totalUsers || 0,
          allProducts: data.allProducts || 0,
          allOrders: data.allOrders || 0,
          totalRevenue: data.totalRevenue || 0,
          orderStatus: data.orderStatus || {},
          recentOrders: data.recentOrders || [],
          categorySales: data.categorySales || [],
          inventory: {
            outOfStockCount:
              data.inventory?.outOfStockCount || 0,
            lowStockCount:
              data.inventory?.lowStockCount || 0,
            outOfStockProducts:
              data.inventory?.outOfStockProducts || [],
            lowStockProducts:
              data.inventory?.lowStockProducts || [],
          },
        });

        setBanner(
          settingsResponse.data?.banner || ''
        );
      } catch (err) {
        console.error(
          'Dashboard loading error:',
          err
        );

        setError(
          'Could not load dashboard information.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleUpdateBanner = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');

    try {
      await api.put('/admin/settings', {
        banner,
      });

      setMessage(
        'Banner updated successfully.'
      );

      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (err) {
      console.error(
        'Banner update error:',
        err
      );

      setError(
        'Could not update banner.'
      );
    }
  };

  const getStatusCount = (status) =>
    stats.orderStatus?.[status] || 0;

  const getCategoryPercentage = (revenue) => {
    const total = stats.categorySales.reduce(
      (sum, item) =>
        sum + Number(item.revenue || 0),
      0
    );

    if (!total) return 0;

    return Math.round(
      (Number(revenue || 0) / total) * 100
    );
  };

  return (
    <div className="admin-dashboard">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="admin-dashboard-header">

        <div>
          <p className="admin-eyebrow">
            SHOP EZ ADMIN
          </p>

          <h2>Dashboard</h2>

          <p className="admin-dashboard-subtitle">
            Manage your store and monitor
            ShopEZ activity.
          </p>
        </div>

        <div className="admin-header-actions">

          <Link
            to="/admin/products"
            className="admin-header-btn"
          >
            Manage Products
          </Link>

          <Link
            to="/admin/orders"
            className="admin-header-btn primary"
          >
            View Orders
          </Link>

        </div>

      </div>

      {error && (
        <div className="admin-alert error">
          {error}
        </div>
      )}

      {/* =================================================
          MAIN STATISTICS
      ================================================= */}

      <div className="stats-grid">

        <div className="stat-card admin-stat-card">

          <div className="stat-icon users-icon">
            👥
          </div>

          <div className="stat-content">

            <p className="stat-label">
              Total Customers
            </p>

            <p className="stat-value">
              {loading
                ? '—'
                : stats.totalUsers}
            </p>

            <Link to="/admin/users">
              View customers →
            </Link>

          </div>

        </div>

        <div className="stat-card admin-stat-card">

          <div className="stat-icon products-icon">
            📦
          </div>

          <div className="stat-content">

            <p className="stat-label">
              Total Products
            </p>

            <p className="stat-value">
              {loading
                ? '—'
                : stats.allProducts}
            </p>

            <Link to="/admin/products">
              Manage catalog →
            </Link>

          </div>

        </div>

        <div className="stat-card admin-stat-card">

          <div className="stat-icon orders-icon">
            🛒
          </div>

          <div className="stat-content">

            <p className="stat-label">
              Total Orders
            </p>

            <p className="stat-value">
              {loading
                ? '—'
                : stats.allOrders}
            </p>

            <Link to="/admin/orders">
              View orders →
            </Link>

          </div>

        </div>

        <div className="stat-card admin-stat-card">

          <div className="stat-icon revenue-icon">
            ₹
          </div>

          <div className="stat-content">

            <p className="stat-label">
              Total Revenue
            </p>

            <p className="stat-value revenue-value">
              {loading
                ? '—'
                : money(stats.totalRevenue)}
            </p>

            <span className="admin-stat-note">
              From non-cancelled orders
            </span>

          </div>

        </div>

      </div>

      {/* =================================================
          SALES OVERVIEW
      ================================================= */}

      <section className="admin-section">

        <div className="admin-section-heading">

          <div>
            <h3>Sales Overview</h3>

            <p>
              Current revenue and order activity
            </p>
          </div>

        </div>

        <div className="sales-overview-grid">

          <div className="revenue-card">

            <div className="revenue-card-top">

              <div>

                <span className="analytics-label">
                  Total Revenue
                </span>

                <h2>
                  {loading
                    ? '—'
                    : money(stats.totalRevenue)}
                </h2>

              </div>

              <div className="revenue-icon-large">
                ₹
              </div>

            </div>

            <div className="revenue-card-footer">

              <span>
                {stats.allOrders} total orders
              </span>

              <span>
                {stats.allProducts} products
              </span>

            </div>

          </div>

          <div className="analytics-card">

            <div className="analytics-card-header">

              <div>

                <h3>Order Status</h3>

                <p>
                  Current order pipeline
                </p>

              </div>

              <Link to="/admin/orders">
                Manage →
              </Link>

            </div>

            <div className="status-grid">

              {statusList.map((status) => (
                <div
                  className="status-summary"
                  key={status}
                >

                  <span className="status-summary-label">
                    {status}
                  </span>

                  <strong>
                    {loading
                      ? '—'
                      : getStatusCount(status)}
                  </strong>

                </div>
              ))}

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          CATEGORY SALES
      ================================================= */}

      <section className="admin-section">

        <div className="admin-section-heading">

          <div>

            <h3>Category Sales</h3>

            <p>
              Revenue distribution across
              product categories
            </p>

          </div>

        </div>

        <div className="analytics-card">

          {loading ? (

            <div className="analytics-loading">
              Loading category sales...
            </div>

          ) : stats.categorySales.length === 0 ? (

            <div className="analytics-empty">

              <strong>
                No sales data yet
              </strong>

              <span>
                Category sales will appear after
                customers place orders.
              </span>

            </div>

          ) : (

            <div className="category-sales-list">

              {stats.categorySales.map(
                (item) => {

                  const percentage =
                    getCategoryPercentage(
                      item.revenue
                    );

                  return (
                    <div
                      className="category-sales-row"
                      key={item.category}
                    >

                      <div className="category-sales-info">

                        <div>

                          <strong>
                            {item.category}
                          </strong>

                          <span>
                            {item.orders}{' '}
                            {item.orders === 1
                              ? 'order'
                              : 'orders'}
                          </span>

                        </div>

                        <strong>
                          {money(item.revenue)}
                        </strong>

                      </div>

                      <div className="category-bar">

                        <div
                          className="category-bar-fill"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                      <span className="category-percentage">
                        {percentage}%
                      </span>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </div>

      </section>

      {/* =================================================
          RECENT ORDERS
      ================================================= */}

      <section className="admin-section">

        <div className="admin-section-heading">

          <div>

            <h3>Recent Orders</h3>

            <p>
              Latest customer purchases
            </p>

          </div>

          <Link
            to="/admin/orders"
            className="admin-section-link"
          >
            View all orders →
          </Link>

        </div>

        <div className="analytics-card recent-orders-card">

          {loading ? (

            <div className="analytics-loading">
              Loading recent orders...
            </div>

          ) : stats.recentOrders.length === 0 ? (

            <div className="analytics-empty">

              <strong>
                No orders yet
              </strong>

              <span>
                Recent orders will appear here.
              </span>

            </div>

          ) : (

            <div className="recent-orders-list">

              {stats.recentOrders.map(
                (order) => (

                  <div
                    className="recent-order-row"
                    key={order._id}
                  >

                    <div className="recent-order-main">

                      <strong>
                        {order.orderNumber ||
                          `#${String(
                            order._id
                          ).slice(-8).toUpperCase()}`}
                      </strong>

                      <span>
                        {order.title}
                      </span>

                    </div>

                    <div className="recent-order-qty">
                      Qty: {order.quantity || 1}
                    </div>

                    <div className="recent-order-status">

                      <span
                        className={`recent-status ${
                          String(
                            order.orderStatus ||
                              ''
                          )
                            .toLowerCase()
                            .replace(
                              /\s+/g,
                              '-'
                            )
                        }`}
                      >
                        {order.orderStatus}
                      </span>

                    </div>

                    <strong className="recent-order-price">
                      {money(
                        order.totalAmount
                      )}
                    </strong>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </section>

      {/* =================================================
          INVENTORY OVERVIEW
      ================================================= */}

      <section className="admin-section">

        <div className="admin-section-heading">

          <div>

            <h3>Inventory Overview</h3>

            <p>
              Monitor products that need
              stock attention.
            </p>

          </div>

          <Link
            to="/admin/products"
            className="admin-section-link"
          >
            Manage inventory →
          </Link>

        </div>

        <div className="inventory-summary-grid">

          <div className="inventory-summary-card low-stock-card">

            <div className="inventory-summary-icon">
              ⚠
            </div>

            <div>

              <span>
                Low Stock
              </span>

              <strong>
                {loading
                  ? '—'
                  : stats.inventory.lowStockCount}
              </strong>

              <small>
                Products with 1–5 items
              </small>

            </div>

          </div>

          <div className="inventory-summary-card out-stock-card">

            <div className="inventory-summary-icon">
              !
            </div>

            <div>

              <span>
                Out of Stock
              </span>

              <strong>
                {loading
                  ? '—'
                  : stats.inventory.outOfStockCount}
              </strong>

              <small>
                Products with no stock
              </small>

            </div>

          </div>

        </div>

        <div className="analytics-card inventory-card">

          {loading ? (

            <div className="analytics-loading">
              Loading inventory...
            </div>

          ) : (
            <>
              {stats.inventory.outOfStockProducts.length >
                0 && (

                <div className="inventory-list-section">

                  <div className="inventory-list-heading">
                    <h4>
                      Out of Stock
                    </h4>

                    <span className="inventory-danger-label">
                      Action required
                    </span>
                  </div>

                  <div className="inventory-product-list">

                    {stats.inventory.outOfStockProducts.map(
                      (product) => (

                        <div
                          className="inventory-product-row out-stock-row"
                          key={product._id}
                        >

                          <div className="inventory-product-info">

                            <div className="inventory-product-icon">
                              📦
                            </div>

                            <div>

                              <strong>
                                {product.title}
                              </strong>

                              <span>
                                {product.category}
                              </span>

                            </div>

                          </div>

                          <span className="inventory-stock out-stock">
                            0 left
                          </span>

                          <Link
                            to={`/admin/edit-products/${product._id}`}
                            className="inventory-edit-btn"
                          >
                            Update Stock
                          </Link>

                        </div>

                      )
                    )}

                  </div>

                </div>

              )}

              {stats.inventory.lowStockProducts.length >
                0 && (

                <div className="inventory-list-section">

                  <div className="inventory-list-heading">

                    <h4>
                      Low Stock Products
                    </h4>

                    <span className="inventory-warning-label">
                      Restock soon
                    </span>

                  </div>

                  <div className="inventory-product-list">

                    {stats.inventory.lowStockProducts.map(
                      (product) => (

                        <div
                          className="inventory-product-row"
                          key={product._id}
                        >

                          <div className="inventory-product-info">

                            <div className="inventory-product-icon">
                              📦
                            </div>

                            <div>

                              <strong>
                                {product.title}
                              </strong>

                              <span>
                                {product.category}
                              </span>

                            </div>

                          </div>

                          <span className="inventory-stock low-stock">
                            {product.stock} left
                          </span>

                          <Link
                            to={`/admin/edit-products/${product._id}`}
                            className="inventory-edit-btn"
                          >
                            Update Stock
                          </Link>

                        </div>

                      )
                    )}

                  </div>

                </div>

              )}

              {stats.inventory.outOfStockProducts.length ===
                0 &&
                stats.inventory.lowStockProducts.length ===
                  0 && (

                  <div className="inventory-empty">

                    <div className="inventory-empty-icon">
                      ✓
                    </div>

                    <strong>
                      Inventory looks good
                    </strong>

                    <span>
                      No products currently need
                      restocking.
                    </span>

                  </div>

                )}
            </>
          )}

        </div>

      </section>

      {/* =================================================
          QUICK ACTIONS
      ================================================= */}

      <section className="admin-section">

        <div className="admin-section-heading">

          <div>

            <h3>Quick Actions</h3>

            <p>
              Common store management tasks
            </p>

          </div>

        </div>

        <div className="admin-quick-actions">

          <Link
            to="/admin/add-product"
            className="admin-action-card"
          >

            <span className="action-card-icon">
              ＋
            </span>

            <div>

              <strong>
                Add Product
              </strong>

              <small>
                Add a new item to your catalog
              </small>

            </div>

            <span className="action-arrow">
              →
            </span>

          </Link>

          <Link
            to="/admin/products"
            className="admin-action-card"
          >

            <span className="action-card-icon">
              📦
            </span>

            <div>

              <strong>
                Manage Products
              </strong>

              <small>
                Edit prices, stock and details
              </small>

            </div>

            <span className="action-arrow">
              →
            </span>

          </Link>

          <Link
            to="/admin/orders"
            className="admin-action-card"
          >

            <span className="action-card-icon">
              🚚
            </span>

            <div>

              <strong>
                Manage Orders
              </strong>

              <small>
                Update customer order status
              </small>

            </div>

            <span className="action-arrow">
              →
            </span>

          </Link>

          <Link
            to="/admin/users"
            className="admin-action-card"
          >

            <span className="action-card-icon">
              👥
            </span>

            <div>

              <strong>
                Manage Customers
              </strong>

              <small>
                View registered customers
              </small>

            </div>

            <span className="action-arrow">
              →
            </span>

          </Link>

        </div>

      </section>

      {/* =================================================
          STORE OVERVIEW
      ================================================= */}

      <section className="admin-section">

        <div className="admin-section-heading">

          <div>

            <h3>Store Overview</h3>

            <p>
              Current ShopEZ catalog and activity
            </p>

          </div>

        </div>

        <div className="admin-overview-card">

          <div className="overview-item">

            <span className="overview-number">
              {loading
                ? '—'
                : stats.allProducts}
            </span>

            <span className="overview-label">
              Products available
            </span>

          </div>

          <div className="overview-divider" />

          <div className="overview-item">

            <span className="overview-number">
              {loading
                ? '—'
                : stats.totalUsers}
            </span>

            <span className="overview-label">
              Registered customers
            </span>

          </div>

          <div className="overview-divider" />

          <div className="overview-item">

            <span className="overview-number">
              {loading
                ? '—'
                : stats.allOrders}
            </span>

            <span className="overview-label">
              Orders received
            </span>

          </div>

        </div>

      </section>

      {/* =================================================
          STORE BANNER
      ================================================= */}

      <section className="admin-section">

        <div className="admin-section-heading">

          <div>

            <h3>Store Banner</h3>

            <p>
              Update the promotional banner
              displayed on the storefront.
            </p>

          </div>

        </div>

        <form
          className="banner-form"
          onSubmit={handleUpdateBanner}
        >

          <label htmlFor="banner-url">
            Banner image URL
          </label>

          <div className="banner-input-row">

            <input
              id="banner-url"
              type="text"
              placeholder="Enter banner image URL"
              value={banner}
              onChange={(e) =>
                setBanner(e.target.value)
              }
            />

            <button type="submit">
              Update Banner
            </button>

          </div>

          {message && (
            <p className="success-text">
              ✓ {message}
            </p>
          )}

        </form>

      </section>

    </div>
  );
};

export default AdminDashboard;