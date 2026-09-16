import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();

    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <header className="navbar">

      {/* ==================== LOGO ==================== */}

      <Link to="/" className="navbar-logo" aria-label="ShopEZ home">
        <span className="logo-cart">🛒</span>
        <span>
          Shop<span>EZ</span>
        </span>
      </Link>

      {/* ==================== SEARCH ==================== */}

      <form className="navbar-search" onSubmit={handleSearch}>
        <span className="search-icon">⌕</span>

        <input
          type="text"
          placeholder="Search for products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>

      {/* ==================== NAVIGATION ==================== */}

      <nav className="navbar-links">

        <Link to="/">
          Home
        </Link>

        <Link
          to="/products"
          className="products-nav-link"
        >
          ▦ <span>Products</span>
        </Link>

        {user && (
          <>
            {/* Cart */}

            <Link
              to="/cart"
              className="cart-nav-link"
            >
              🛒 <span>Cart</span>
            </Link>

            {/* Wishlist */}

            <Link
              to="/wishlist"
              className="wishlist-nav-link"
            >
              ♡ <span>Wishlist</span>
            </Link>
          </>
        )}

        {user ? (
          <>
            {/* Account */}

            <Link
              to="/profile"
              className="account-nav-link"
            >
              ● <span>Account</span>⌄
            </Link>

            {/* Admin */}

            {user.usertype === 'Admin' && (
              <Link to="/admin">
                Admin
              </Link>
            )}

            {/* Logout */}

            <button
              className="link-btn"
              onClick={logout}
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="login-btn"
          >
            Login
          </Link>
        )}

      </nav>
    </header>
  );
};

export default Navbar;