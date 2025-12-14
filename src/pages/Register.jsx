import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/language';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { language, toggleLanguage } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    pregnancyWeek: 8,
    dueDate: '',
    language: language,
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

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError(language === 'en' 
        ? 'Passwords do not match' 
        : 'Nenosiri hazifanani');
      return;
    }

    if (formData.password.length < 6) {
      setError(language === 'en' 
        ? 'Password must be at least 6 characters' 
        : 'Nenosiri lazima liwe na angalau herufi 6');
      return;
    }

    setLoading(true);

    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || (language === 'en' ? 'Registration failed' : 'Usajili umeshindwa'));
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
          <h2>{language === 'en' ? 'Create Account' : 'Tengeneza Akaunti'}</h2>
        </div>
        <p className="auth-subtitle">
          {language === 'en' 
            ? 'Join Healthy Mom to track your pregnancy journey' 
            : 'Jiunge na Healthy Mom ili kufuatilia safari yako ya ujauzito'}
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">
              {language === 'en' ? 'Full Name' : 'Jina Kamili'} *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder={language === 'en' ? 'Your name' : 'Jina lako'}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              {language === 'en' ? 'Email' : 'Barua Pepe'} *
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
            <label htmlFor="phone">
              {language === 'en' ? 'Phone Number' : 'Nambari ya Simu'} (Optional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder={language === 'en' ? '+254 700 000 000' : '+254 700 000 000'}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              {language === 'en' ? 'Password' : 'Nenosiri'} *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder={language === 'en' ? 'At least 6 characters' : 'Angalau herufi 6'}
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              {language === 'en' ? 'Confirm Password' : 'Thibitisha Nenosiri'} *
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder={language === 'en' ? 'Re-enter password' : 'Ingiza nenosiri tena'}
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="pregnancyWeek">
              {language === 'en' ? 'Current Pregnancy Week' : 'Wiki ya Ujauzito'} (Optional)
            </label>
            <input
              type="number"
              id="pregnancyWeek"
              name="pregnancyWeek"
              value={formData.pregnancyWeek}
              onChange={handleChange}
              min="1"
              max="40"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">
              {language === 'en' ? 'Due Date' : 'Tarehe ya Kujifungua'} (Optional)
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading 
              ? (language === 'en' ? 'Creating account...' : 'Inaunda akaunti...') 
              : (language === 'en' ? 'Register' : 'Jisajili')}
          </button>
        </form>

        <p className="auth-footer">
          {language === 'en' ? 'Already have an account? ' : 'Tayari una akaunti? '}
          <Link to="/login" className="auth-link">
            {language === 'en' ? 'Login here' : 'Ingia hapa'}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

