import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("shopez_token");

  const loadWishlist = async () => {
    try {
      const response = await fetch(`${API_URL}/api/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Wishlist loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await fetch(
        `${API_URL}/api/wishlist/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Remove wishlist error:", error);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  if (loading) {
    return (
      <div className="wishlist-page">
        <h2>My Wishlist</h2>
        <p>Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <div>
          <h1>My Wishlist</h1>
          <p>
            {products.length} {products.length === 1 ? "item" : "items"} saved
          </p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="wishlist-empty">
          <div className="wishlist-empty-icon">♡</div>
          <h2>Your wishlist is empty</h2>
          <p>Save products you love and find them here later.</p>

          <Link to="/products" className="wishlist-shop-btn">
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {products.map((product) => (
            <div className="wishlist-card" key={product._id}>
              <Link to={`/products/${product._id}`}>
                <img
                  src={product.mainImg}
                  alt={product.title}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </Link>

              <div className="wishlist-card-content">
                <Link
                  to={`/products/${product._id}`}
                  className="wishlist-product-title"
                >
                  {product.title}
                </Link>

                <p className="wishlist-category">
                  {product.category}
                </p>

                <div className="wishlist-price">
                  ₹{Number(product.price || 0).toLocaleString("en-IN")}
                </div>

                <div className="wishlist-actions">
                  <Link
                    to={`/products/${product._id}`}
                    className="wishlist-view-btn"
                  >
                    View Product
                  </Link>

                  <button
                    className="wishlist-remove-btn"
                    onClick={() => removeFromWishlist(product._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;