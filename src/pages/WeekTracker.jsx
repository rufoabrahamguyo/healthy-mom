import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getTranslation } from '../utils/language';
import { getWeekData } from '../data/pregnancyWeeks';
import { Icons } from '../components/Icons';
import './WeekTracker.css';

const WeekTracker = () => {
  const { language } = useLanguage();
  const { user, updateUser } = useAuth();
  const t = (key) => getTranslation(key, language);
  
  const [currentWeek, setCurrentWeek] = useState(user?.pregnancyWeek || 8);
  const [dueDate, setDueDate] = useState(
    user?.dueDate ? new Date(user.dueDate).toISOString().split('T')[0] : ''
  );

  // Sync with user data when user loads
  useEffect(() => {
    if (user) {
      setCurrentWeek(user.pregnancyWeek || 8);
      if (user.dueDate) {
        setDueDate(new Date(user.dueDate).toISOString().split('T')[0]);
      }
    }
  }, [user]);

  const weekData = getWeekData(currentWeek, language);

  const handleWeekChange = async (newWeek) => {
    setCurrentWeek(newWeek);
    if (user) {
      await updateUser({ pregnancyWeek: newWeek });
    }
  };

  const handleDueDateChange = async (e) => {
    const date = e.target.value;
    setDueDate(date);
    
    if (date) {
      const due = new Date(date);
      const today = new Date();
      const diffTime = due - today;
      const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
      const weeksPregnant = 40 - diffWeeks;
      if (weeksPregnant >= 1 && weeksPregnant <= 40) {
        setCurrentWeek(weeksPregnant);
        if (user) {
          await updateUser({ 
            pregnancyWeek: weeksPregnant,
            dueDate: date 
          });
        }
      } else if (user) {
        await updateUser({ dueDate: date });
      }
    } else if (user) {
      await updateUser({ dueDate: null });
    }
  };

  return (
    <div className="week-tracker">
      <div className="tracker-header">
        <h2>{t('tracker.title')}</h2>
        <div className="week-selector">
          <button 
            onClick={() => handleWeekChange(Math.max(1, currentWeek - 1))}
            disabled={currentWeek === 1}
            className="week-btn"
          >
            ←
          </button>
          <span className="current-week">
            {t('tracker.currentWeek').replace('{week}', currentWeek)}
          </span>
          <button 
            onClick={() => handleWeekChange(Math.min(40, currentWeek + 1))}
            disabled={currentWeek === 40}
            className="week-btn"
          >
            →
          </button>
        </div>
        <div className="due-date-input">
          <label>{language === 'en' ? 'Due Date:' : 'Tarehe ya Kujifungua:'}</label>
          <input 
            type="date" 
            value={dueDate} 
            onChange={handleDueDateChange}
            className="date-input"
          />
        </div>
      </div>

      <div className="week-content">
        <div className="baby-size-card">
          <h3>{t('tracker.babySize')}</h3>
          <div className="size-display">
            {weekData.babySize}
          </div>
        </div>

        <div className="info-section">
          <h3>{t('tracker.development')}</h3>
          <p>{weekData.development}</p>
        </div>

        <div className="info-section">
          <h3>{t('tracker.bodyChanges')}</h3>
          <p>{weekData.bodyChanges}</p>
        </div>

        <div className="checklist-section">
          <h3>{t('tracker.toDo')}</h3>
          <ul className="checklist">
            {weekData.toDo.map((item, index) => (
              <li key={index} className="checklist-item">
                <span className="check-icon">
                  <Icons.check size={18} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="tips-section">
          <h3>{t('tracker.tips')}</h3>
          <p className="tip-text">{weekData.tips}</p>
        </div>
      </div>
    </div>
  );
};

export default WeekTracker;

