import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getTranslation } from '../utils/language';
import { userDataAPI } from '../utils/userDataAPI';
import { ReminderIcons, Icons } from '../components/Icons';
import './Reminders.css';

const Reminders = () => {
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const t = (key) => getTranslation(key, language);

  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReminders();
  }, [isAuthenticated, language]);

  const loadReminders = async () => {
    try {
      setLoading(true);
      if (isAuthenticated) {
        const response = await userDataAPI.getData('reminders');
        if (response.success && response.data && response.data.entries) {
          setReminders(response.data.entries);
        } else {
          setReminders(getDefaultReminders(language));
        }
      } else {
        const saved = localStorage.getItem('reminders');
        if (saved) {
          setReminders(JSON.parse(saved));
        } else {
          setReminders(getDefaultReminders(language));
        }
      }
    } catch (error) {
      console.error('Error loading reminders:', error);
      const saved = localStorage.getItem('reminders');
      if (saved) {
        setReminders(JSON.parse(saved));
      } else {
        setReminders(getDefaultReminders(language));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('reminders', JSON.stringify(reminders));
    }
  }, [reminders, isAuthenticated]);

  function getDefaultReminders(lang) {
    return {
      en: [
        { id: 1, type: 'water', enabled: true, times: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'], label: 'Drink Water', icon: ReminderIcons.water, description: 'Stay hydrated throughout the day' },
        { id: 2, type: 'vitamins', enabled: true, times: ['09:00'], label: 'Take Prenatal Vitamins', icon: ReminderIcons.vitamins, description: 'Take your daily prenatal vitamins' },
        { id: 3, type: 'stretch', enabled: true, times: ['10:00', '15:00'], label: 'Gentle Stretches', icon: ReminderIcons.stretch, description: 'Do gentle pregnancy-safe stretches' },
        { id: 4, type: 'meals', enabled: true, times: ['08:00', '13:00', '19:00'], label: 'Eat Regular Meals', icon: ReminderIcons.meals, description: 'Eat small, frequent meals' },
        { id: 5, type: 'rest', enabled: true, times: ['14:00'], label: 'Rest Break', icon: ReminderIcons.rest, description: 'Take a rest break' },
        { id: 6, type: 'kicks', enabled: true, times: ['20:00'], label: 'Count Baby Kicks', icon: ReminderIcons.kicks, description: 'Track your baby\'s movements' }
      ],
      sw: [
        { id: 1, type: 'water', enabled: true, times: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'], label: 'Kunywa Maji', icon: ReminderIcons.water, description: 'Kaa na maji mazuri siku nzima' },
        { id: 2, type: 'vitamins', enabled: true, times: ['09:00'], label: 'Chukua Vitamini za Ujauzito', icon: ReminderIcons.vitamins, description: 'Chukua vitamini zako za kila siku' },
        { id: 3, type: 'stretch', enabled: true, times: ['10:00', '15:00'], label: 'Kujinyosha Kwa Upole', icon: ReminderIcons.stretch, description: 'Fanya mazoezi ya kujinyosha salama wakati wa ujauzito' },
        { id: 4, type: 'meals', enabled: true, times: ['08:00', '13:00', '19:00'], label: 'Kula Mlo wa Kawaida', icon: ReminderIcons.meals, description: 'Kula milo midogo mara kwa mara' },
        { id: 5, type: 'rest', enabled: true, times: ['14:00'], label: 'Mapumziko', icon: ReminderIcons.rest, description: 'Chukua mapumziko' },
        { id: 6, type: 'kicks', enabled: true, times: ['20:00'], label: 'Hesabu Vuguvugu vya Mtoto', icon: ReminderIcons.kicks, description: 'Fuatilia harakati za mtoto wako' }
      ]
    }[lang];
  }

  const toggleReminder = async (id) => {
    const reminder = reminders.find(r => r._id === id || r.id === id);
    if (!reminder) return;

    const updatedReminder = { ...reminder, enabled: !reminder.enabled };
    const updated = reminders.map(rem => 
      (rem._id === id || rem.id === id) ? updatedReminder : rem
    );
    setReminders(updated);
    
    if (isAuthenticated) {
      try {
        await userDataAPI.saveData('reminders', { entries: updated });
      } catch (error) {
        console.error('Error updating reminder:', error);
      }
    } else {
      localStorage.setItem('reminders', JSON.stringify(updated));
    }
  };

  const warningSigns = {
    en: [
      { sign: 'Severe abdominal pain', action: 'Contact healthcare provider immediately' },
      { sign: 'Heavy bleeding', action: 'Go to emergency room' },
      { sign: 'Severe headache with vision changes', action: 'Contact healthcare provider immediately' },
      { sign: 'Decreased fetal movement', action: 'Contact healthcare provider' },
      { sign: 'Fever over 38°C (100.4°F)', action: 'Contact healthcare provider' },
      { sign: 'Severe swelling', action: 'Contact healthcare provider' },
      { sign: 'Water breaking before 37 weeks', action: 'Go to hospital immediately' },
      { sign: 'Regular contractions before 37 weeks', action: 'Contact healthcare provider immediately' }
    ],
    sw: [
      { sign: 'Maumivu makali ya tumbo', action: 'Wasiliana na mhudumu wa afya mara moja' },
      { sign: 'Kuvuja damu kwa wingi', action: 'Nenda hospitalini kwa dharura' },
      { sign: 'Kichwa kikubwa na mabadiliko ya kuona', action: 'Wasiliana na mhudumu wa afya mara moja' },
      { sign: 'Kupungua kwa harakati za mtoto', action: 'Wasiliana na mhudumu wa afya' },
      { sign: 'Homa zaidi ya 38°C', action: 'Wasiliana na mhudumu wa afya' },
      { sign: 'Uvimbe mkubwa', action: 'Wasiliana na mhudumu wa afya' },
      { sign: 'Maji kuvunja kabla ya wiki 37', action: 'Nenda hospitalini mara moja' },
      { sign: 'Mikazo ya kawaida kabla ya wiki 37', action: 'Wasiliana na mhudumu wa afya mara moja' }
    ]
  };

  return (
    <div className="reminders">
      <h2>{language === 'en' ? 'Reminders & Alerts' : 'Ukumbusho na Matangazo'}</h2>

      <div className="reminders-section">
        <h3>{language === 'en' ? 'Daily Reminders' : 'Ukumbusho wa Kila Siku'}</h3>
        <p className="section-description">
          {language === 'en' 
            ? 'Set up reminders to help you stay on track with your pregnancy care.'
            : 'Weka ukumbusho ili kukusaidia kukaa katika njia na huduma yako ya ujauzito.'}
        </p>

        <div className="reminders-list">
          {reminders.map(reminder => (
            <div key={reminder.id} className={`reminder-card ${reminder.enabled ? 'enabled' : 'disabled'}`}>
              <div className="reminder-header">
                <div className="reminder-icon">
                  {reminder.icon && <reminder.icon size={32} />}
                </div>
                <div className="reminder-info">
                  <h4>{reminder.label}</h4>
                  <p>{reminder.description}</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={reminder.enabled}
                    onChange={() => toggleReminder(reminder.id)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              {reminder.enabled && (
                <div className="reminder-times">
                  <strong>{language === 'en' ? 'Reminder times:' : 'Muda wa ukumbusho:'}</strong>
                  <div className="times-list">
                    {reminder.times.map((time, idx) => (
                      <span key={idx} className="time-badge">{time}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="warning-signs-section">
        <h3>{language === 'en' ? 'Warning Signs to Watch For' : 'Ishara za Onyo za Kuangalia'}</h3>
        <p className="section-description">
          {language === 'en' 
            ? 'If you experience any of these symptoms, contact your healthcare provider immediately.'
            : 'Ikiwa unapata dalili yoyote kati ya hizi, wasiliana na mhudumu wako wa afya mara moja.'}
        </p>

        <div className="warning-signs-list">
          {warningSigns[language].map((warning, index) => (
            <div key={index} className="warning-card">
              <div className="warning-icon">
                <Icons.warning size={24} />
              </div>
              <div className="warning-content">
                <div className="warning-sign">{warning.sign}</div>
                <div className="warning-action">{warning.action}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="emergency-contact">
          <h4>{language === 'en' ? 'Emergency Contacts' : 'Nambari za Dharura'}</h4>
          <div className="contact-buttons">
            <a href="tel:+254722202133" className="emergency-btn">
              <Icons.phone size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              {language === 'en' ? 'Call Emergency' : 'Piga Simu ya Dharura'}
            </a>
            <a href="tel:+254722202133" className="emergency-btn">
              <Icons.hospital size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              {language === 'en' ? 'Call Hospital' : 'Piga Hospitali'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reminders;

