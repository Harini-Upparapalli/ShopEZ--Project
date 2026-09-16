import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { fallbackProducts } from '../assets/fallbackProducts';

const categoryOptions = [
  { name: 'Mobiles', icon: '📱' },
  { name: 'Electronics', icon: '💻' },
  { name: 'Fashion', icon: '👕' },
  { name: 'Groceries', icon: '🛒' },
  { name: 'Sports-Equipment', icon: '⚽' },
];

const genderOptions = [
  { name: 'Men', icon: '👔' },
  { name: 'Women', icon: '👗' },
];

const isCategoryMatch = (optionName, currentCategory) => {
  if (!optionName || !currentCategory) return false;
  const opt = String(optionName).trim().toLowerCase();
  const cur = String(currentCategory).trim().toLowerCase();
  if (opt === cur) return true;
  return (
    (opt === 'sports' || opt === 'sports-equipment') &&
    (cur === 'sports' || cur === 'sports-equipment')
  );
};

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const sort = searchParams.get('sort') || 'popular';
  const category = searchParams.get('category') || '';
  const gender = searchParams.get('gender') || '';
  const search = searchParams.get('search') || '';
  const isFashionCategory = isCategoryMatch('Fashion', category);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let dataset = [];

        if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
          dataset = fallbackProducts;
        } else {
          try {
            const params = {};
            if (category) params.category = category;
            if (gender && isFashionCategory) params.gender = gender;
            if (sort !== 'popular') params.sort = sort;

            const { data } = await api.get('/products', { params });
            dataset = Array.isArray(data) && data.length ? data : fallbackProducts;
          } catch {
            dataset = fallbackProducts;
          }
        }

        let result = dataset;

        if (category) {
          result = result.filter((p) => isCategoryMatch(p.category, category));
        }

        if (gender && isFashionCategory) {
          const selected = gender.toLowerCase();
          result = result.filter(
            (p) => String(p.gender || '').toLowerCase() === selected
          );
        }

        if (search) {
          const term = search.toLowerCase();
          result = result.filter((p) =>
            String(p.title || '').toLowerCase().includes(term)
          );
        }

        if (sort === 'price_low') {
          result = [...result].sort((a, b) => a.price - b.price);
        } else if (sort === 'price_high') {
          result = [...result].sort((a, b) => b.price - a.price);
        } else if (sort === 'discount') {
          result = [...result].sort((a, b) => (b.discount || 0) - (a.discount || 0));
        }

        setProducts(result);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, gender, sort, search, isFashionCategory]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);

    if (value) params.set(key, value);
    else params.delete(key);

    if (key === 'category' && value !== 'Fashion') {
      params.delete('gender');
    }

    setSearchParams(params);
  };

  const clearFilters = () => setSearchParams({});

  const title = category
    ? category === 'Sports-Equipment'
      ? 'Sports'
      : category
    : 'All Products';

  const sortLabel = {
    popular: 'Popular',
    price_low: 'Price Low',
    price_high: 'Price High',
    discount: 'Discount',
  }[sort] || 'Popular';

  return (
    <div className="products-page">
      <aside className="filters">
        <div className="filter-title-row">
          <h2>⚱ Filter Products</h2>
        </div>

        <button className="clear-filter" onClick={clearFilters}>
          Clear All
        </button>

        <div className="filter-group">
          <h4>Sort By</h4>
          {[
            ['popular', '🔥 Popular'],
            ['price_low', '↕ Price Low'],
            ['price_high', '↕ Price High'],
            ['discount', '％ Discount'],
          ].map(([value, label]) => (
            <label key={value} className={sort === value ? 'active-filter' : ''}>
              <input
                type="radio"
                name="sort"
                checked={sort === value}
                onChange={() => updateParam('sort', value)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>

        <div className="filter-group">
          <h4>Category</h4>
          {categoryOptions.map((cat) => {
            const active = isCategoryMatch(cat.name, category);
            return (
              <label key={cat.name} className={active ? 'active-filter' : ''}>
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => updateParam('category', active ? '' : cat.name)}
                />
                <span className="category-label">
                  <span>{cat.icon}</span>
                  {cat.name === 'Sports-Equipment' ? 'Sports' : cat.name}
                </span>
              </label>
            );
          })}
        </div>

        {isFashionCategory && (
          <div className="filter-group">
            <h4>Gender</h4>
            {genderOptions.map((g) => (
              <label
                key={g.name}
                className={gender === g.name ? 'active-filter' : ''}
              >
                <input
                  type="checkbox"
                  checked={gender === g.name}
                  onChange={() =>
                    updateParam('gender', gender === g.name ? '' : g.name)
                  }
                />
                <span className="category-label">
                  <span>{g.icon}</span>
                  {g.name}
                </span>
              </label>
            ))}
          </div>
        )}
      </aside>

      <main className="product-list">
        <div className="catalog-heading">
          <div className="catalog-title-wrap">
            <h1 className="page-title">
              <span className="title-icon">{category === 'Mobiles' ? '📱' : '▦'}</span>
              {title}
              <span className="product-count">({products.length} Products)</span>
            </h1>
          </div>

          <select
            className="catalog-sort"
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            aria-label="Sort products"
          >
            <option value="popular">Sort: Popular</option>
            <option value="price_low">Sort: Price Low</option>
            <option value="price_high">Sort: Price High</option>
            <option value="discount">Sort: Discount</option>
          </select>
        </div>

        {loading ? (
          <div className="catalog-loading">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="catalog-empty">
            <div>🔎</div>
            <h3>No products found</h3>
            <p>Try changing your filters or search.</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;
