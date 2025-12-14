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
  const [editingMood, setEditingMood] = useState(null);
  const [editMoodValue, setEditMoodValue] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  const [showSleepTips, setShowSleepTips] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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
        setHasUnsavedChanges(false);
      }
    }
  }, [moods]);

  const loadMoods = async () => {
    try {
      setLoading(true);
      if (isAuthenticated) {
        const response = await userDataAPI.getMoods();
        if (response.success && response.moods) {
          setMoods(response.moods);
          localStorage.setItem('moodHistory', JSON.stringify(response.moods));
        } else {
          // Fallback to localStorage
          const saved = localStorage.getItem('moodHistory');
          if (saved) {
            setMoods(JSON.parse(saved));
          }
        }
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

  const handleMoodSelect = (moodValue) => {
    setTodayMood(moodValue);
    setHasUnsavedChanges(true);
  };

  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (!todayMood) {
      alert(language === 'en' 
        ? 'Please select a mood first'
        : 'Tafadhali chagua mhemko kwanza');
      return;
    }
    await saveMood(todayMood, notes);
    setHasUnsavedChanges(false);
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
      setHasUnsavedChanges(false);
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
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving mood:', error);
      // Data still saved to localStorage, so continue
      setHasUnsavedChanges(false);
    }
  };

  const handleEditMood = (entry) => {
    setEditingMood(entry.date);
    setEditMoodValue(entry.mood);
    setEditNotes(entry.notes || '');
  };

  const handleSaveEdit = async () => {
    if (!editingMood) return;

    try {
      const updatedMoods = moods.map(m => 
        m.date === editingMood 
          ? { ...m, mood: editMoodValue, notes: editNotes }
          : m
      );
      updatedMoods.sort((a, b) => new Date(b.date) - new Date(a.date));
      setMoods(updatedMoods);
      localStorage.setItem('moodHistory', JSON.stringify(updatedMoods));

      if (isAuthenticated) {
        await userDataAPI.updateMood(editingMood, {
          mood: editMoodValue,
          notes: editNotes
        });
      }

      setEditingMood(null);
      setEditMoodValue('');
      setEditNotes('');
    } catch (error) {
      console.error('Error updating mood:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingMood(null);
    setEditMoodValue('');
    setEditNotes('');
  };

  const handleDeleteMood = async (date) => {
    if (!window.confirm(language === 'en' 
      ? 'Are you sure you want to delete this mood entry?'
      : 'Je, una uhakika unataka kufuta kiingilio hiki cha mhemko?')) {
      return;
    }

    try {
      const updatedMoods = moods.filter(m => m.date !== date);
      setMoods(updatedMoods);
      localStorage.setItem('moodHistory', JSON.stringify(updatedMoods));

      if (isAuthenticated) {
        await userDataAPI.deleteMood(date);
      }
    } catch (error) {
      console.error('Error deleting mood:', error);
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
        <div className="save-section">
          <button 
            onClick={handleSave} 
            className="save-mood-btn"
            disabled={!todayMood}
          >
            {language === 'en' ? 'Save Mood' : 'Hifadhi Mhemko'}
          </button>
        </div>
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
            <button className="support-btn" onClick={() => setShowBreathingExercise(true)}>
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
            <button className="support-btn" onClick={() => setShowSleepTips(true)}>
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
              const isEditing = editingMood === entry.date;
              
              return (
                <div key={`${entry.date}-${index}`} className="history-entry">
                  {isEditing ? (
                    <div className="edit-mood-form">
                      <select 
                        value={editMoodValue} 
                        onChange={(e) => setEditMoodValue(e.target.value)}
                        className="edit-mood-select"
                      >
                        {moodOptions.map(m => (
                          <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                      </select>
                      <textarea
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder={language === 'en' ? 'Notes...' : 'Maelezo...'}
                        className="edit-notes-input"
                        rows="2"
                      />
                      <div className="edit-actions">
                        <button onClick={handleSaveEdit} className="save-btn">
                          {language === 'en' ? 'Save' : 'Hifadhi'}
                        </button>
                        <button onClick={handleCancelEdit} className="cancel-btn">
                          {language === 'en' ? 'Cancel' : 'Ghairi'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="history-header-row">
                        <div className="history-date">
                          {new Date(entry.date).toLocaleDateString(language === 'en' ? 'en-US' : 'sw-KE', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="history-actions">
                          <button 
                            onClick={() => handleEditMood(entry)} 
                            className="edit-mood-btn"
                            title={language === 'en' ? 'Edit' : 'Hariri'}
                          >
                            <Icons.edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteMood(entry.date)} 
                            className="delete-mood-btn"
                            title={language === 'en' ? 'Delete' : 'Futa'}
                          >
                            <Icons.delete size={16} />
                          </button>
                        </div>
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
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showBreathingExercise && (
        <div className="modal-overlay" onClick={() => setShowBreathingExercise(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowBreathingExercise(false)}>
              ×
            </button>
            <h3>{language === 'en' ? 'Breathing Exercise' : 'Zoezi la Kupumua'}</h3>
            <div className="breathing-exercise">
              <p>{language === 'en' 
                ? 'Follow these steps for deep breathing:'
                : 'Fuata hatua hizi za kupumua kwa kina:'}</p>
              <ol>
                <li>{language === 'en' ? 'Sit comfortably or lie down' : 'Keti vizuri au lala chini'}</li>
                <li>{language === 'en' ? 'Breathe in slowly through your nose for 4 counts' : 'Pumua polepole kupitia pua yako kwa hesabu 4'}</li>
                <li>{language === 'en' ? 'Hold your breath for 4 counts' : 'Shika pumzi yako kwa hesabu 4'}</li>
                <li>{language === 'en' ? 'Exhale slowly through your mouth for 4 counts' : 'Toa pumzi polepole kupitia mdomo wako kwa hesabu 4'}</li>
                <li>{language === 'en' ? 'Repeat 5-10 times' : 'Rudia mara 5-10'}</li>
              </ol>
              <p className="breathing-tip">
                {language === 'en' 
                  ? 'This exercise can help reduce stress and anxiety. Practice daily for best results.'
                  : 'Zoezi hili linaweza kusaidia kupunguza mfadhaiko na wasiwasi. Fanya kila siku kwa matokeo bora.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {showSleepTips && (
        <div className="modal-overlay" onClick={() => setShowSleepTips(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowSleepTips(false)}>
              ×
            </button>
            <h3>{language === 'en' ? 'Sleep Tips for Pregnancy' : 'Vidokezo vya Kulala Wakati wa Ujauzito'}</h3>
            <div className="sleep-tips">
              <ul>
                <li>{language === 'en' ? 'Sleep on your left side to improve blood flow to your baby' : 'Lala upande wako wa kushoto ili kuboresha mtiririko wa damu kwa mtoto wako'}</li>
                <li>{language === 'en' ? 'Use pillows to support your belly and between your knees' : 'Tumia mto kusaidia tumbo lako na kati ya magoti yako'}</li>
                <li>{language === 'en' ? 'Avoid caffeine and large meals before bedtime' : 'Epuka kafeini na chakula kikubwa kabla ya kulala'}</li>
                <li>{language === 'en' ? 'Establish a regular sleep schedule' : 'Weka ratiba ya kulala ya kawaida'}</li>
                <li>{language === 'en' ? 'Create a relaxing bedtime routine (warm bath, reading, gentle music)' : 'Unda desturi ya kutuliza kabla ya kulala (kuoga maji ya joto, kusoma, muziki wa polepole)'}</li>
                <li>{language === 'en' ? 'Keep your bedroom cool, dark, and quiet' : 'Weka chumba chako cha kulala kiwe baridi, giza, na kimya'}</li>
                <li>{language === 'en' ? 'Practice relaxation techniques like deep breathing before bed' : 'Fanya mbinu za kutuliza kama kupumua kwa kina kabla ya kulala'}</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodTracker;

