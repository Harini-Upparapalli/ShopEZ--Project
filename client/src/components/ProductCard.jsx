import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/image';

const categoryFallback = {
  Mobiles: ['📱', 'Smartphone'],
  Electronics: ['💻', 'Electronics'],
  Fashion: ['👕', 'Fashion'],
  Groceries: ['🛒', 'Groceries'],
  'Sports-Equipment': ['⚽', 'Sports'],
};

const getFallbackSvg = (product) => {
  const [icon, label] =
    categoryFallback[product.category] || ['🛍️', 'ShopEZ'];

  const safeTitle = String(product.title || label).slice(0, 24);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="500" viewBox="0 0 600 500">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f7f4ff"/>
          <stop offset="100%" stop-color="#e9e4ff"/>
        </linearGradient>
      </defs>

      <rect width="600" height="500" fill="url(#g)"/>

      <circle cx="300" cy="190" r="105" fill="#ffffff"/>

      <text
        x="300"
        y="225"
        text-anchor="middle"
        font-size="105"
        font-family="Arial"
      >
        ${icon}
      </text>

      <text
        x="300"
        y="360"
        text-anchor="middle"
        font-size="25"
        font-weight="700"
        fill="#4f36c5"
        font-family="Arial"
      >
        ${label}
      </text>

      <text
        x="300"
        y="400"
        text-anchor="middle"
        font-size="19"
        fill="#666"
        font-family="Arial"
      >
        ${safeTitle}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [liked, setLiked] = useState(false);
  const [imageSrc, setImageSrc] = useState(
    getImageUrl(product.mainImg)
  );

  const [wishlistLoading, setWishlistLoading] = useState(false);

  const API_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const finalPrice = Math.round(
    product.price -
      (product.price * (product.discount || 0)) / 100
  );

  // ==================== CHECK WISHLIST ====================

  useEffect(() => {
    const checkWishlist = async () => {
      const token = localStorage.getItem('shopez_token');

      if (!user || !token || !product?._id) {
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/wishlist`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        const wishlistProducts = data.products || [];

        const exists = wishlistProducts.some(
          (item) => item._id === product._id
        );

        setLiked(exists);
      } catch (error) {
        console.error(
          'Wishlist check error:',
          error
        );
      }
    };

    checkWishlist();
  }, [user, product?._id, API_URL]);

  // ==================== TOGGLE WISHLIST ====================

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    const token = localStorage.getItem('shopez_token');

    if (!token) {
      navigate('/login');
      return;
    }

    if (wishlistLoading) {
      return;
    }

    setWishlistLoading(true);

    try {
      const method = liked ? 'DELETE' : 'POST';

      const response = await fetch(
        `${API_URL}/api/wishlist/${product._id}`,
        {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          'Wishlist error:',
          data.message
        );
        return;
      }

      setLiked(!liked);
    } catch (error) {
      console.error(
        'Wishlist update error:',
        error
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <article className="product-card">

      {/* ==================== DISCOUNT ==================== */}

      {product.discount > 0 && (
        <span className="discount-badge">
          {product.discount}% OFF
        </span>
      )}

      {/* ==================== WISHLIST ==================== */}

      <button
        type="button"
        className={`wishlist-btn ${liked ? 'liked' : ''}`}
        onClick={handleWishlist}
        disabled={wishlistLoading}
        aria-label={
          liked
            ? 'Remove from wishlist'
            : 'Add to wishlist'
        }
        title={
          liked
            ? 'Remove from wishlist'
            : 'Add to wishlist'
        }
      >
        {liked ? '♥' : '♡'}
      </button>

      {/* ==================== PRODUCT IMAGE ==================== */}

      <Link
        to={`/products/${product._id}`}
        className="product-image-link"
      >
        <div className="product-image-container">
          <img
            src={imageSrc}
            alt={product.title}
            loading="lazy"
            onError={() =>
              setImageSrc(getFallbackSvg(product))
            }
          />
        </div>
      </Link>

      {/* ==================== PRODUCT INFORMATION ==================== */}

      <div className="product-info">

        <div
          className="rating"
          aria-label="5 star rating"
        >
          ★★★★★
        </div>

        <h3 title={product.title}>
          {product.title}
        </h3>

        <p className="product-desc">
          {String(product.description || '').slice(
            0,
            68
          )}

          {String(product.description || '').length >
            68
            ? '...'
            : ''}
        </p>

        {/* ==================== PRICE ==================== */}

        <div className="price-box">

          <span className="price">
            ₹{finalPrice.toLocaleString('en-IN')}
          </span>

          {product.discount > 0 && (
            <span className="mrp">
              ₹
              {Number(product.price).toLocaleString(
                'en-IN'
              )}
            </span>
          )}

        </div>

        {/* ==================== ADD TO CART ==================== */}

        <Link
          to={`/products/${product._id}`}
          className="shop-now-btn product-btn"
        >
          🛒 Add to Cart
        </Link>

      </div>
    </article>
  );
};

export default ProductCard;