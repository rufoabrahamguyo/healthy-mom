import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/language';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const t = (key) => getTranslation(key, language);


  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || (language === 'en' ? 'Login failed' : 'Kuingia kumeshindwa'));
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <Link to="/welcome" className="auth-back-link">
          ← {language === 'en' ? 'Back' : 'Rudi'}
        </Link>
        <button className="auth-language-toggle" onClick={toggleLanguage}>
          {language === 'en' ? 'SW' : 'EN'}
        </button>
      </div>
      <div className="auth-card">
        <div className="auth-card-header">
          <h2>{language === 'en' ? 'Login' : 'Ingia'}</h2>
        </div>
        <p className="auth-subtitle">
          {language === 'en' 
            ? 'Welcome back! Please login to continue.' 
            : 'Karibu tena! Tafadhali ingia ili kuendelea.'}
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">
              {language === 'en' ? 'Email' : 'Barua Pepe'}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder={language === 'en' ? 'your@email.com' : 'barua@pepe.com'}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              {language === 'en' ? 'Password' : 'Nenosiri'}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder={language === 'en' ? 'Enter your password' : 'Ingiza nenosiri lako'}
              minLength="6"
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading 
              ? (language === 'en' ? 'Logging in...' : 'Inaingia...') 
              : (language === 'en' ? 'Login' : 'Ingia')}
          </button>
        </form>

        <p className="auth-footer">
          {language === 'en' ? "Don't have an account? " : "Huna akaunti? "}
          <Link to="/register" className="auth-link">
            {language === 'en' ? 'Register here' : 'Jisajili hapa'}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

