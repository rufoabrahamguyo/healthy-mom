import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getTranslation } from '../utils/language';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const t = (key) => getTranslation(key, language);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Don't show navigation on auth pages
  if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/welcome') {
    return null;
  }

  return (
    <nav className="navigation">
      <div className="nav-header">
        <div className="nav-logo-container">
          <img src="/logo2.png" alt="Healthy Mom" className="nav-logo" />
          <h1 className="app-title">{t('appName')}</h1>
        </div>
        <div className="nav-header-right">
          {isAuthenticated && user && (
            <span className="user-name">
              {language === 'en' ? 'Hello' : 'Hujambo'}, {user.name.split(' ')[0]}!
            </span>
          )}
          <button className="language-toggle" onClick={toggleLanguage}>
            {language === 'en' ? 'SW' : 'EN'}
          </button>
          {isAuthenticated && (
            <button className="logout-btn" onClick={handleLogout}>
              {language === 'en' ? 'Logout' : 'Toka'}
            </button>
          )}
        </div>
      </div>
      {isAuthenticated && (
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            {t('nav.tracker')}
          </Link>
          <Link 
            to="/library" 
            className={`nav-link ${isActive('/library') ? 'active' : ''}`}
          >
            {t('nav.library')}
          </Link>
          <Link 
            to="/clinics" 
            className={`nav-link ${isActive('/clinics') ? 'active' : ''}`}
          >
            {t('nav.clinics')}
          </Link>
          <Link 
            to="/mood" 
            className={`nav-link ${isActive('/mood') ? 'active' : ''}`}
          >
            {t('nav.mood')}
          </Link>
          <Link 
            to="/kicks" 
            className={`nav-link ${isActive('/kicks') ? 'active' : ''}`}
          >
            {t('nav.kicks')}
          </Link>
          <Link 
            to="/contractions" 
            className={`nav-link ${isActive('/contractions') ? 'active' : ''}`}
          >
            {t('nav.contractions')}
          </Link>
          <Link 
            to="/appointments" 
            className={`nav-link ${isActive('/appointments') ? 'active' : ''}`}
          >
            {t('nav.appointments')}
          </Link>
          <Link 
            to="/prep" 
            className={`nav-link ${isActive('/prep') ? 'active' : ''}`}
          >
            {t('nav.prep')}
          </Link>
          <Link 
            to="/reminders" 
            className={`nav-link ${isActive('/reminders') ? 'active' : ''}`}
          >
            {t('nav.reminders')}
          </Link>
          <Link 
            to="/nutrition" 
            className={`nav-link ${isActive('/nutrition') ? 'active' : ''}`}
          >
            {t('nav.nutrition')}
          </Link>
          <Link 
            to="/forum" 
            className={`nav-link ${isActive('/forum') ? 'active' : ''}`}
          >
            {t('nav.forum')}
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navigation;

