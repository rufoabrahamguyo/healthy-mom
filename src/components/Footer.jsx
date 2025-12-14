import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Footer.css';

const Footer = () => {
  const { language } = useLanguage();
  const location = useLocation();

  // Don't show footer on auth pages
  if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/welcome') {
    return null;
  }

  return (
    <footer className="app-footer">
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
  );
};

export default Footer;

