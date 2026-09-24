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

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    usertype: 'Customer',
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
    const cleanUsername = form.username.trim();

    if (!cleanUsername) {
      setError('Please enter your username.');
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setError(
        'Please enter a valid email address with at least one letter before @.'
      );
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      await register(
        cleanUsername,
        cleanEmail,
        form.password,
        form.usertype
      );

      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Registration failed. Please try again.'
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
          max-width: 1040px;
          min-height: 610px;
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
          width: 250px;
          height: 250px;
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 50%;
          top: -100px;
          right: -90px;
        }

        .auth-brand-panel::after {
          content: "";
          position: absolute;
          width: 190px;
          height: 190px;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 50%;
          bottom: -95px;
          left: -75px;
        }

        .auth-brand-content {
          position: relative;
          z-index: 2;
        }

        .auth-logo {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 32px;
          font-size: 26px;
          font-weight: 800;
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
        }

        .auth-brand-panel h1 {
          margin: 0;
          font-size: 39px;
          line-height: 1.15;
          letter-spacing: -1px;
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
          padding: 42px 58px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .auth-form-modern {
          width: 100%;
          max-width: 430px;
        }

        .auth-heading {
          margin-bottom: 25px;
        }

        .auth-heading h2 {
          margin: 0;
          color: #202124;
          font-size: 31px;
          font-weight: 800;
          letter-spacing: -0.7px;
        }

        .auth-heading p {
          margin: 8px 0 0;
          color: #777;
          font-size: 14px;
        }

        .auth-error {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 16px;
          padding: 12px 14px;
          border: 1px solid #f1c8d0;
          border-radius: 12px;
          background: #fff4f6;
          color: #bd3048;
          font-size: 13px;
          line-height: 1.5;
        }

        .auth-field {
          margin-bottom: 15px;
        }

        .auth-field label {
          display: block;
          margin-bottom: 7px;
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
          height: 50px;
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

        .auth-select {
          width: 100%;
          height: 50px;
          padding: 0 15px;
          border: 1px solid #ddd9e8;
          border-radius: 12px;
          outline: none;
          background: #fbfaff;
          color: #25232d;
          font-size: 14px;
          cursor: pointer;
        }

        .auth-select:focus {
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
          margin-top: 8px;
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
          margin: 20px 0 0;
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
          margin-top: 22px;
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
            font-size: 31px;
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
            font-size: 27px;
          }

          .auth-form-panel {
            padding: 30px 22px;
          }

          .auth-heading h2 {
            font-size: 27px;
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
                Start your shopping journey with{' '}
                <span>ShopEZ</span>
              </h1>

              <p className="auth-brand-description">
                Create your account and enjoy a simple, convenient
                online shopping experience.
              </p>

              <div className="auth-benefits">

                <div className="auth-benefit">
                  <span className="auth-benefit-icon">✓</span>
                  <span>Explore products from different categories</span>
                </div>

                <div className="auth-benefit">
                  <span className="auth-benefit-icon">♡</span>
                  <span>Save products to your wishlist</span>
                </div>

                <div className="auth-benefit">
                  <span className="auth-benefit-icon">📦</span>
                  <span>Place and track your orders easily</span>
                </div>

              </div>

            </div>
          </section>

          {/* RIGHT REGISTER FORM */}
          <section className="auth-form-panel">
            <form
              className="auth-form-modern"
              onSubmit={handleSubmit}
            >

              <div className="auth-heading">
                <h2>Create your account</h2>
                <p>Join ShopEZ and start shopping today.</p>
              </div>

              {error && (
                <div className="auth-error">
                  <span>⚠</span>
                  <span>{error}</span>
                </div>
              )}

              {/* USERNAME */}
              <div className="auth-field">
                <label htmlFor="register-username">
                  Username
                </label>

                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">●</span>

                  <input
                    id="register-username"
                    className="auth-input"
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="auth-field">
                <label htmlFor="register-email">
                  Email address
                </label>

                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">✉</span>

                  <input
                    id="register-email"
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

              {/* PASSWORD */}
              <div className="auth-field">
                <label htmlFor="register-password">
                  Password
                </label>

                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">🔒</span>

                  <input
                    id="register-password"
                    className="auth-input"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
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

              {/* USER TYPE */}
              <div className="auth-field">
                <label htmlFor="register-usertype">
                  Account type
                </label>

                <select
                  id="register-usertype"
                  className="auth-select"
                  name="usertype"
                  value={form.usertype}
                  onChange={handleChange}
                >
                  <option value="Customer">
                    Customer
                  </option>

                  <option value="Admin">
                    Admin
                  </option>
                </select>
              </div>

              <button
                className="auth-submit"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? 'Creating account...'
                  : 'Create ShopEZ Account'}
              </button>

              <p className="auth-switch">
                Already have an account?{' '}
                <Link to="/login">Login here</Link>
              </p>

              <div className="auth-security-note">
                <span>🔐</span>
                <span>
                  Your account information is securely protected.
                </span>
              </div>

            </form>
          </section>

        </div>
      </main>
    </>
  );
};

export default Register;