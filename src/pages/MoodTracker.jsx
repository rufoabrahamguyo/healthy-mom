import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getTranslation } from '../utils/language';
import { userDataAPI } from '../utils/userDataAPI';
import { MoodIcons, Icons } from '../components/Icons';
import './MoodTracker.css';

const MoodTracker = () => {
  const { language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const t = (key) => getTranslation(key, language);

  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayMood, setTodayMood] = useState(null);
  const [notes, setNotes] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const moodOptions = [
    { icon: MoodIcons.happy, value: 'happy', label: language === 'en' ? 'Happy' : 'Furaha' },
    { icon: MoodIcons.calm, value: 'calm', label: language === 'en' ? 'Calm' : 'Utulivu' },
    { icon: MoodIcons.sad, value: 'sad', label: language === 'en' ? 'Sad' : 'Huzuni' },
    { icon: MoodIcons.anxious, value: 'anxious', label: language === 'en' ? 'Anxious' : 'Wasiwasi' },
    { icon: MoodIcons.tired, value: 'tired', label: language === 'en' ? 'Tired' : 'Uchovu' },
    { icon: MoodIcons.angry, value: 'angry', label: language === 'en' ? 'Frustrated' : 'Hasira' },
    { icon: MoodIcons.nauseous, value: 'nauseous', label: language === 'en' ? 'Nauseous' : 'Kichefuchefu' },
    { icon: MoodIcons.excited, value: 'excited', label: language === 'en' ? 'Excited' : 'Msisimko' },
  ];

  // Load moods from MongoDB
  useEffect(() => {
    if (isAuthenticated) {
      loadMoods();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Set today's mood when moods load
  useEffect(() => {
    if (moods.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const todayEntry = moods.find(m => m.date === today);
      if (todayEntry) {
        setTodayMood(todayEntry.mood);
        setNotes(todayEntry.notes || '');
      }
    }
  }, [moods]);

  const loadMoods = async () => {
    try {
      setLoading(true);
      const response = await userDataAPI.getData('mood');
      if (response.success && response.data && response.data.entries) {
        setMoods(response.data.entries);
        localStorage.setItem('moodHistory', JSON.stringify(response.data.entries));
      } else {
        // Fallback to localStorage
        const saved = localStorage.getItem('moodHistory');
        if (saved) {
          setMoods(JSON.parse(saved));
        }
      }
    } catch (error) {
      console.error('Error loading moods:', error);
      // Fallback to localStorage
      const saved = localStorage.getItem('moodHistory');
      if (saved) {
        setMoods(JSON.parse(saved));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSelect = async (moodValue) => {
    setTodayMood(moodValue);
    await saveMood(moodValue, notes);
  };

  const handleNotesChange = async (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    if (todayMood) {
      await saveMood(todayMood, newNotes);
    }
  };

  const saveMood = async (mood, notesText) => {
    if (!isAuthenticated) {
      // Fallback to localStorage if not authenticated
      const today = new Date().toISOString().split('T')[0];
      const updatedMoods = moods.filter(m => m.date !== today);
      updatedMoods.push({
        date: today,
        mood,
        notes: notesText,
        timestamp: new Date().toISOString()
      });
      updatedMoods.sort((a, b) => new Date(b.date) - new Date(a.date));
      setMoods(updatedMoods);
      localStorage.setItem('moodHistory', JSON.stringify(updatedMoods));
      return;
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      const updatedMoods = moods.filter(m => m.date !== today);
      updatedMoods.push({
        date: today,
        mood,
        notes: notesText,
        timestamp: new Date().toISOString()
      });
      updatedMoods.sort((a, b) => new Date(b.date) - new Date(a.date));
      setMoods(updatedMoods);
      localStorage.setItem('moodHistory', JSON.stringify(updatedMoods));
      
      // Sync to MongoDB
      await userDataAPI.saveData('mood', { entries: updatedMoods });
    } catch (error) {
      console.error('Error saving mood:', error);
      // Data still saved to localStorage, so continue
    }
  };

  const getMoodInsights = () => {
    if (moods.length < 3) return null;

    const recentMoods = moods.slice(0, 7);
    const moodCounts = {};
    recentMoods.forEach(m => {
      moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
    });

    const mostCommon = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b
    );

    const moodOption = moodOptions.find(m => m.value === mostCommon);
    const MoodIcon = moodOption?.icon;

    return {
      mostCommon,
      count: moodCounts[mostCommon],
      total: recentMoods.length,
      icon: MoodIcon
    };
  };

  const insights = getMoodInsights();

  return (
    <div className="mood-tracker">
      <h2>{language === 'en' ? 'Mood & Mental Health Tracker' : 'Kufuatilia Mhemko na Afya ya Akili'}</h2>

      <div className="mood-section">
        <h3>{language === 'en' ? 'How are you feeling today?' : 'Unajisikiaje leo?'}</h3>
        <div className="mood-grid">
          {moodOptions.map(mood => (
            <button
              key={mood.value}
              className={`mood-btn ${todayMood === mood.value ? 'selected' : ''}`}
              onClick={() => handleMoodSelect(mood.value)}
            >
              <span className="mood-icon">
                {mood.icon && <mood.icon size={32} />}
              </span>
              <span className="mood-label">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="notes-section">
        <label>
          {language === 'en' ? 'Notes (optional)' : 'Maelezo (si lazima)'}
        </label>
        <textarea
          value={notes}
          onChange={handleNotesChange}
          placeholder={language === 'en' 
            ? 'How are you feeling? Any concerns or things you\'d like to remember?'
            : 'Unajisikiaje? Kuna wasiwasi wowote au mambo ungependa kukumbuka?'}
          rows="4"
          className="mood-notes"
        />
      </div>

      {insights && (
        <div className="insights-section">
          <h3>{language === 'en' ? 'Your Mood Insights' : 'Ufahamu wa Mhemko Wako'}</h3>
          <div className="insight-card">
            <div className="insight-icon">
              {insights.icon && <insights.icon size={48} />}
            </div>
            <div className="insight-text">
              {language === 'en' 
                ? `Over the past week, you've felt ${moodOptions.find(m => m.value === insights.mostCommon)?.label.toLowerCase()} most often.`
                : `Katika wiki iliyopita, umekuwa ukihisi ${moodOptions.find(m => m.value === insights.mostCommon)?.label.toLowerCase()} mara nyingi zaidi.`}
            </div>
          </div>
        </div>
      )}

      <div className="support-section">
        <h3>{language === 'en' ? 'Need Support?' : 'Unahitaji Msaada?'}</h3>
        <div className="support-cards">
          <div className="support-card">
            <span className="support-icon">
              <Icons.heartbeat size={24} />
            </span>
            <h4>{language === 'en' ? 'Mindfulness' : 'Ufahamu'}</h4>
            <p>{language === 'en' 
              ? 'Try deep breathing exercises to help manage stress and anxiety.'
              : 'Jaribu mazoezi ya kupumua kwa kina ili kusaidia kusimamia mfadhaiko na wasiwasi.'}</p>
            <button className="support-btn">
              {language === 'en' ? 'Start Breathing Exercise' : 'Anza Zoezi la Kupumua'}
            </button>
          </div>

          <div className="support-card">
            <span className="support-icon">
              <Icons.phone size={24} />
            </span>
            <h4>{language === 'en' ? 'Crisis Support' : 'Msaada wa Dharura'}</h4>
            <p>{language === 'en' 
              ? 'If you\'re feeling overwhelmed, reach out for help.'
              : 'Ikiwa unajisikia kuzidiwa, tafuta msaada.'}</p>
            <a href="tel:+254722202133" className="support-btn">
              {language === 'en' ? 'Call Helpline' : 'Piga Simu ya Msaada'}
            </a>
          </div>

          <div className="support-card">
            <span className="support-icon">
              <Icons.bed size={24} />
            </span>
            <h4>{language === 'en' ? 'Sleep Support' : 'Msaada wa Kulala'}</h4>
            <p>{language === 'en' 
              ? 'Pregnancy-safe sleep tips and relaxation techniques.'
              : 'Vidokezo vya kulala salama wakati wa ujauzito na mbinu za kutuliza.'}</p>
            <button className="support-btn">
              {language === 'en' ? 'View Sleep Tips' : 'Angalia Vidokezo vya Kulala'}
            </button>
          </div>
        </div>
      </div>

      {moods.length > 0 && (
        <div className="history-section">
          <h3>{language === 'en' ? 'Mood History' : 'Historia ya Mhemko'}</h3>
          <div className="mood-history">
            {moods.slice(0, 7).map((entry, index) => {
              const moodOption = moodOptions.find(m => m.value === entry.mood);
              return (
                <div key={index} className="history-entry">
                  <div className="history-date">
                    {new Date(entry.date).toLocaleDateString(language === 'en' ? 'en-US' : 'sw-KE', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="history-mood">
                    <span className="history-emoji">
                      {moodOption?.icon && <moodOption.icon size={24} />}
                    </span>
                    <span>{moodOption?.label}</span>
                  </div>
                  {entry.notes && (
                    <div className="history-notes">{entry.notes}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodTracker;

