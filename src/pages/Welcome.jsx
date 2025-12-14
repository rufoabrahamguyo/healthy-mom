import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/language';
import './Welcome.css';

const Welcome = () => {
  const { language, toggleLanguage } = useLanguage();
  const t = (key) => getTranslation(key, language);

  return (
    <div className="welcome-container">
      <div className="welcome-header">
        <button className="language-toggle" onClick={toggleLanguage}>
          {language === 'en' ? 'SW' : 'EN'}
        </button>
      </div>

      <div className="welcome-content">
        <div className="welcome-logo">
          <img src="/logo2.png" alt="Healthy Mom" className="welcome-logo-img" />
          
          <p className="welcome-tagline">
            {language === 'en' 
              ? 'Your trusted companion for a safe and healthy pregnancy journey'
              : 'Rafiki wako wa kuaminika kwa safari salama na ya afya ya ujauzito'}
          </p>
        </div>

        <div className="welcome-features">
          <div className="feature-card">
            <h3>{language === 'en' ? 'Week Tracker' : 'Kufuatilia Wiki'}</h3>
            <p>{language === 'en' 
              ? 'Track your pregnancy week by week'
              : 'Fuatilia wiki yako ya ujauzito kwa wiki'}</p>
          </div>

          <div className="feature-card">
            <h3>{language === 'en' ? 'Health Library' : 'Maktaba ya Afya'}</h3>
            <p>{language === 'en' 
              ? 'Access reliable health information'
              : 'Pata taarifa za kuaminika za afya'}</p>
          </div>

          <div className="feature-card">
            <h3>{language === 'en' ? 'Clinic Finder' : 'Kupata Kliniki'}</h3>
            <p>{language === 'en' 
              ? 'Find nearby healthcare facilities'
              : 'Tafuta vituo vya afya vya karibu'}</p>
          </div>

          <div className="feature-card">
            <h3>{language === 'en' ? 'Community Forum' : 'Jukwaa la Jamii'}</h3>
            <p>{language === 'en' 
              ? 'Connect with other expecting mothers'
              : 'Ungana na wanawake wengine wajawazito'}</p>
          </div>
        </div>

        <div className="welcome-actions">
          <Link to="/login" className="welcome-btn primary">
            {language === 'en' ? 'Get Started' : 'Anza Sasa'}
          </Link>
          <Link to="/register" className="welcome-btn secondary">
            {language === 'en' ? 'Create Account' : 'Tengeneza Akaunti'}
          </Link>
        </div>

        <p className="welcome-footer">
          {language === 'en' 
            ? 'Already have an account?'
            : 'Tayari una akaunti?'}
          {' '}
          <Link to="/login" className="welcome-link">
            {language === 'en' ? 'Login' : 'Ingia'}
          </Link>
        </p>
      </div>

      <footer className="welcome-page-footer">
        <div className="footer-content">
          <p className="footer-text">
            {language === 'en' 
              ? 'This app does not provide medical diagnosis. Always consult a healthcare professional for personal medical advice.'
              : 'Programu hii haitoi utambuzi wa matibabu. Daima wasiliana na mtaalamu wa afya kwa ushauri wa matibabu binafsi.'}
          </p>
          <p className="footer-copyright">
            © {new Date().getFullYear()} Healthy Mom. {language === 'en' ? 'All rights reserved.' : 'Haki zote zimehifadhiwa.'}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;

