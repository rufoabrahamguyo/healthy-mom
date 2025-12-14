import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/language';
import { clinics, getClinicsByLocation } from '../data/clinics';
import { Icons } from '../components/Icons';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import './ClinicFinder.css';

const ClinicFinder = () => {
  const { language } = useLanguage();
  const t = (key) => getTranslation(key, language);
  
  const [searchLocation, setSearchLocation] = useState('');
  const [sortBy, setSortBy] = useState('cost'); // 'cost' or 'staff'
  
  const filteredClinics = getClinicsByLocation(searchLocation);
  
  const sortedClinics = [...filteredClinics].sort((a, b) => {
    if (sortBy === 'cost') {
      return b.costRating - a.costRating; // Higher rating = more affordable
    } else {
      return b.staffRating - a.staffRating;
    }
  });

  const renderStars = (rating) => {
    return (
      <>
        {[...Array(5)].map((_, i) => (
          <span key={i}>
            {i < rating ? (
              <FaStar size={14} color="#ffd700" />
            ) : (
              <FaStar size={14} color="#ddd" />
            )}
          </span>
        ))}
      </>
    );
  };

  return (
    <div className="clinic-finder">
      <h2>{t('clinics.title')}</h2>
      
      <div className="search-controls">
        <input
          type="text"
          placeholder={t('clinics.searchPlaceholder')}
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          className="search-input"
        />
        
        <div className="sort-options">
          <label>
            <input
              type="radio"
              name="sort"
              value="cost"
              checked={sortBy === 'cost'}
              onChange={(e) => setSortBy(e.target.value)}
            />
            {t('clinics.costFriendly')}
          </label>
          <label>
            <input
              type="radio"
              name="sort"
              value="staff"
              checked={sortBy === 'staff'}
              onChange={(e) => setSortBy(e.target.value)}
            />
            {t('clinics.staffFriendly')}
          </label>
        </div>
      </div>

      <div className="clinics-list">
        {sortedClinics.length === 0 ? (
          <p className="no-clinics">
            {language === 'en' 
              ? 'No clinics found. Try a different location.' 
              : 'Hakuna kliniki zilizopatikana. Jaribu eneo jingine.'}
          </p>
        ) : (
          sortedClinics.map(clinic => (
            <div key={clinic.id} className="clinic-card">
              {clinic.verified && (
                <div className="verified-badge">
                  <Icons.check size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  {t('clinics.verified')}
                </div>
              )}
              
              <h3>{language === 'sw' && clinic.nameSwahili ? clinic.nameSwahili : clinic.name}</h3>
              
              <div className="clinic-info">
                <p className="clinic-type">{clinic.type}</p>
                <p className="clinic-location">
                  <Icons.location size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  {clinic.location}
                </p>
              </div>

              <div className="ratings">
                <div className="rating-item">
                  <span className="rating-label">{t('clinics.costFriendly')}:</span>
                  <span className="rating-stars">{renderStars(clinic.costRating)}</span>
                </div>
                <div className="rating-item">
                  <span className="rating-label">{t('clinics.staffFriendly')}:</span>
                  <span className="rating-stars">{renderStars(clinic.staffRating)}</span>
                </div>
              </div>

              <div className="clinic-services">
                <strong>{t('clinics.services')}:</strong>
                <div className="services-list">
                  {clinic.services.map((service, index) => (
                    <span key={index} className="service-tag">{service}</span>
                  ))}
                </div>
              </div>

              <a href={`tel:${clinic.phone}`} className="call-btn">
                <Icons.phone size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                {t('clinics.call')}: {clinic.phone}
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClinicFinder;

