import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const isValidEmail = (email) => {
  const value = email.trim();

  // At least one letter must exist before @.
  // Numbers and common special characters are allowed.
  return /^(?=[^@\s]*[A-Za-z])[^@\s]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
    value
  );
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = form.email.trim();

    if (!isValidEmail(cleanEmail)) {
      setError(
        'Please enter a valid email address with at least one letter before @.'
      );
      return;
    }

    if (!form.password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      await login(cleanEmail, form.password);
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .auth-page-modern {
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 45px 30px;
          background:
            radial-gradient(circle at 10% 20%, rgba(112, 78, 220, 0.12), transparent 30%),
            radial-gradient(circle at 90% 80%, rgba(91, 62, 203, 0.10), transparent 30%),
            #f7f6fc;
        }

        .auth-shell {
          width: 100%;
          max-width: 980px;
          min-height: 560px;
          display: grid;
          grid-template-columns: 0.95fr 1.05fr;
          background: #ffffff;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 25px 70px rgba(54, 35, 120, 0.15);
          border: 1px solid rgba(91, 62, 203, 0.08);
        }

        .auth-brand-panel {
          position: relative;
          overflow: hidden;
          padding: 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          color: #ffffff;
          background:
            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.18), transparent 28%),
            radial-gradient(circle at 85% 85%, rgba(255,255,255,0.12), transparent 30%),
            linear-gradient(145deg, #6d4be5 0%, #5033c5 55%, #38239b 100%);
        }

        .auth-brand-panel::before {
          content: "";
          position: absolute;
          width: 230px;
          height: 230px;
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 50%;
          top: -90px;
          right: -80px;
        }

        .auth-brand-panel::after {
          content: "";
          position: absolute;
          width: 180px;
          height: 180px;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 50%;
          bottom: -90px;
          left: -70px;
        }

        .auth-brand-content {
          position: relative;
          z-index: 2;
        }

        .auth-logo {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 35px;
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .auth-logo-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          background: rgba(255,255,255,0.16);
          border: 1px solid rgba(255,255,255,0.22);
          font-size: 24px;
          backdrop-filter: blur(8px);
        }

        .auth-brand-panel h1 {
          margin: 0;
          font-size: 42px;
          line-height: 1.12;
          letter-spacing: -1.2px;
        }

        .auth-brand-panel h1 span {
          color: #ddd3ff;
        }

        .auth-brand-description {
          margin: 18px 0 30px;
          max-width: 390px;
          color: rgba(255,255,255,0.82);
          font-size: 15px;
          line-height: 1.7;
        }

        .auth-benefits {
          display: grid;
          gap: 14px;
        }

        .auth-benefit {
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255,255,255,0.94);
          font-size: 14px;
        }

        .auth-benefit-icon {
          width: 32px;
          height: 32px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: rgba(255,255,255,0.14);
        }

        .auth-form-panel {
          padding: 50px 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .auth-form-modern {
          width: 100%;
          max-width: 400px;
        }

        .auth-heading {
          margin-bottom: 30px;
        }

        .auth-heading h2 {
          margin: 0;
          color: #202124;
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.7px;
        }

        .auth-heading p {
          margin: 8px 0 0;
          color: #777;
          font-size: 14px;
          line-height: 1.5;
        }

        .auth-error {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 18px;
          padding: 12px 14px;
          border: 1px solid #f1c8d0;
          border-radius: 12px;
          background: #fff4f6;
          color: #bd3048;
          font-size: 13px;
          line-height: 1.5;
        }

        .auth-field {
          margin-bottom: 18px;
        }

        .auth-field label {
          display: block;
          margin-bottom: 8px;
          color: #3d3b46;
          font-size: 13px;
          font-weight: 700;
        }

        .auth-input-wrapper {
          position: relative;
        }

        .auth-input-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #8d87a5;
          font-size: 17px;
          pointer-events: none;
        }

        .auth-input {
          width: 100%;
          height: 52px;
          box-sizing: border-box;
          padding: 0 45px;
          border: 1px solid #ddd9e8;
          border-radius: 12px;
          outline: none;
          background: #fbfaff;
          color: #25232d;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .auth-input::placeholder {
          color: #aaa6b5;
        }

        .auth-input:focus {
          background: #ffffff;
          border-color: #5b3ecb;
          box-shadow: 0 0 0 4px rgba(91,62,203,0.10);
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          color: #77718f;
          cursor: pointer;
          font-size: 16px;
          padding: 5px;
        }

        .password-toggle:hover {
          color: #5b3ecb;
        }

        .auth-submit {
          width: 100%;
          height: 52px;
          margin-top: 7px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #6847df, #5032c5);
          color: #ffffff;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 10px 25px rgba(91,62,203,0.24);
          transition: all 0.2s ease;
        }

        .auth-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 14px 30px rgba(91,62,203,0.30);
        }

        .auth-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .auth-switch {
          margin: 22px 0 0;
          text-align: center;
          color: #777;
          font-size: 14px;
        }

        .auth-switch a {
          color: #573bd3;
          font-weight: 800;
          text-decoration: none;
        }

        .auth-switch a:hover {
          text-decoration: underline;
        }

        .auth-security-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          margin-top: 28px;
          color: #999;
          font-size: 12px;
        }

        @media (max-width: 800px) {
          .auth-page-modern {
            padding: 25px 16px;
          }

          .auth-shell {
            grid-template-columns: 1fr;
            max-width: 520px;
          }

          .auth-brand-panel {
            padding: 35px;
          }

          .auth-brand-panel h1 {
            font-size: 32px;
          }

          .auth-benefits {
            display: none;
          }

          .auth-form-panel {
            padding: 40px 30px;
          }
        }

        @media (max-width: 480px) {
          .auth-brand-panel {
            padding: 28px;
          }

          .auth-brand-panel h1 {
            font-size: 28px;
          }

          .auth-form-panel {
            padding: 32px 22px;
          }

          .auth-heading h2 {
            font-size: 28px;
          }
        }
      `}</style>

      <main className="auth-page-modern">
        <div className="auth-shell">

          {/* LEFT BRAND PANEL */}
          <section className="auth-brand-panel">
            <div className="auth-brand-content">

              <div className="auth-logo">
                <span className="auth-logo-icon">🛒</span>
                <span>
                  Shop<span style={{ color: '#ddd3ff' }}>EZ</span>
                </span>
              </div>

              <h1>
                Welcome back to <span>ShopEZ</span>
              </h1>

              <p className="auth-brand-description">
                Your simple and convenient online shopping experience.
                Discover products, manage your orders and shop with ease.
              </p>

              <div className="auth-benefits">
                <div className="auth-benefit">
                  <span className="auth-benefit-icon">✓</span>
                  <span>Browse products across multiple categories</span>
                </div>

                <div className="auth-benefit">
                  <span className="auth-benefit-icon">🛍</span>
                  <span>Manage your cart and wishlist easily</span>
                </div>

                <div className="auth-benefit">
                  <span className="auth-benefit-icon">📦</span>
                  <span>Track your orders from one place</span>
                </div>
              </div>

            </div>
          </section>

          {/* RIGHT LOGIN FORM */}
          <section className="auth-form-panel">
            <form
              className="auth-form-modern"
              onSubmit={handleSubmit}
            >
              <div className="auth-heading">
                <h2>Welcome back</h2>
                <p>Login to continue shopping with ShopEZ.</p>
              </div>

              {error && (
                <div className="auth-error">
                  <span>⚠</span>
                  <span>{error}</span>
                </div>
              )}

              <div className="auth-field">
                <label htmlFor="login-email">Email address</label>

                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">✉</span>

                  <input
                    id="login-email"
                    className="auth-input"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="login-password">Password</label>

                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">🔒</span>

                  <input
                    id="login-password"
                    className="auth-input"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showPassword ? '◉' : '◌'}
                  </button>
                </div>
              </div>

              <button
                className="auth-submit"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login to ShopEZ'}
              </button>

              <p className="auth-switch">
                Don't have an account?{' '}
                <Link to="/register">Create an account</Link>
              </p>

              <div className="auth-security-note">
                <span>🔐</span>
                <span>Your account information is securely protected.</span>
              </div>
            </form>
          </section>

        </div>
      </main>
    </>
  );
};

export default Login;