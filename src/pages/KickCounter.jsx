import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getTranslation } from '../utils/language';
import { userDataAPI } from '../utils/userDataAPI';
import { Icons } from '../components/Icons';
import './KickCounter.css';

const KickCounter = () => {
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const t = (key) => getTranslation(key, language);

  const [kicks, setKicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCounting, setIsCounting] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadKicks();
    } else {
      // Fallback to localStorage
      const saved = localStorage.getItem('kickHistory');
      if (saved) {
        setKicks(JSON.parse(saved));
      }
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isCounting && startTime) {
      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setSessionDuration(elapsed);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isCounting, startTime]);

  const startSession = () => {
    setIsCounting(true);
    setStartTime(Date.now());
    setSessionDuration(0);
  };

  const loadKicks = async () => {
    try {
      setLoading(true);
      if (isAuthenticated) {
        const response = await userDataAPI.getKicks();
        if (response.success && response.kicks) {
          setKicks(response.kicks.map(k => ({
            time: typeof k.time === 'number' ? k.time : new Date(k.time).getTime(),
            sessionTime: k.sessionTime || 0
          })));
          localStorage.setItem('kickHistory', JSON.stringify(response.kicks));
        }
      } else {
        // Fallback to localStorage
        const saved = localStorage.getItem('kickHistory');
        if (saved) {
          const parsedKicks = JSON.parse(saved);
          setKicks(parsedKicks.map(k => ({
            time: typeof k.time === 'number' ? k.time : new Date(k.time).getTime(),
            sessionTime: k.sessionTime || 0
          })));
        }
      }
    } catch (error) {
      console.error('Error loading kicks:', error);
      // Fallback to localStorage on error
      const saved = localStorage.getItem('kickHistory');
      if (saved) {
        const parsedKicks = JSON.parse(saved);
        setKicks(parsedKicks.map(k => ({
          time: typeof k.time === 'number' ? k.time : new Date(k.time).getTime(),
          sessionTime: k.sessionTime || 0
        })));
      }
    } finally {
      setLoading(false);
    }
  };

  const recordKick = async () => {
    if (!isCounting) {
      console.log('Cannot record kick: session not started');
      return;
    }

    const newKick = {
      time: Date.now(),
      sessionTime: sessionDuration
    };

    // Update local state immediately for better UX
    const updatedKicks = [...kicks, newKick];
    setKicks(updatedKicks);

    if (isAuthenticated) {
      try {
        await userDataAPI.saveKick({
          time: new Date(newKick.time).toISOString(),
          sessionTime: newKick.sessionTime
        });
        // Reload to ensure sync
        await loadKicks();
      } catch (error) {
        console.error('Error saving kick:', error);
        // Keep local state even if sync fails
      }
    } else {
      // Fallback to localStorage
      localStorage.setItem('kickHistory', JSON.stringify(updatedKicks));
    }
  };

  const stopSession = () => {
    setIsCounting(false);
    setStartTime(null);
    setSessionDuration(0);
  };

  const resetSession = async () => {
    if (isAuthenticated) {
      try {
        await userDataAPI.clearKicks();
        await loadKicks();
      } catch (error) {
        console.error('Error clearing kicks:', error);
      }
    } else {
      setKicks([]);
      localStorage.removeItem('kickHistory');
    }
    setIsCounting(false);
    setStartTime(null);
    setSessionDuration(0);
  };

  const getTodayKicks = () => {
    const today = new Date().toISOString().split('T')[0];
    return kicks.filter(k => {
      const kickDate = new Date(k.time).toISOString().split('T')[0];
      return kickDate === today;
    });
  };

  const getSessionKicks = () => {
    if (!startTime) return [];
    return kicks.filter(k => k.time >= startTime);
  };

  const getInsights = () => {
    if (kicks.length < 5) return null;

    const recentKicks = kicks.slice(-10);
    const intervals = [];
    for (let i = 1; i < recentKicks.length; i++) {
      intervals.push((recentKicks[i].time - recentKicks[i - 1].time) / 1000 / 60); // minutes
    }

    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const sessionKicks = getSessionKicks();

    return {
      totalToday: getTodayKicks().length,
      sessionCount: sessionKicks.length,
      avgInterval: avgInterval.toFixed(1),
      pattern: avgInterval < 5 ? 'active' : avgInterval < 15 ? 'normal' : 'quiet'
    };
  };

  const insights = getInsights();
  const sessionKicks = getSessionKicks();
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="kick-counter">
      <h2>{language === 'en' ? 'Baby Kick Counter' : 'Kuhesabu Vuguvugu vya Mtoto'}</h2>

      <div className="info-card">
        <p className="info-text">
          {language === 'en' 
            ? 'Count your baby\'s movements. Most babies move at least 10 times in 2 hours. If you notice decreased movement, contact your healthcare provider.'
            : 'Hesabu harakati za mtoto wako. Watoto wengi husonga angalau mara 10 katika masaa 2. Ikiwa unagundua kupungua kwa harakati, wasiliana na mhudumu wako wa afya.'}
        </p>
      </div>

      <div className="counter-section">
        <div className="session-info">
          {isCounting ? (
            <>
              <div className="timer">{formatTime(sessionDuration)}</div>
              <div className="session-status">
                {language === 'en' ? 'Counting...' : 'Inahesabu...'}
              </div>
            </>
          ) : (
            <div className="session-status">
              {language === 'en' ? 'Ready to start counting' : 'Tayari kuanza kuhesabu'}
            </div>
          )}
        </div>

        <div className="kick-display">
          <div className="kick-count-large">{sessionKicks.length}</div>
          <div className="kick-label">
            {language === 'en' ? 'Kicks this session' : 'Vuguvugu katika kikao hiki'}
          </div>
        </div>

        <div className="controls">
          {!isCounting ? (
            <button className="start-btn" onClick={startSession}>
              {language === 'en' ? 'Start Counting' : 'Anza Kuhesabu'}
            </button>
          ) : (
            <>
              <button className="kick-btn" onClick={recordKick}>
                <Icons.baby size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                {language === 'en' ? 'Record Kick' : 'Rekodi Vuguvugu'}
              </button>
              <button className="stop-btn" onClick={stopSession}>
                {language === 'en' ? 'Stop Session' : 'Acha Kikao'}
              </button>
            </>
          )}
          {kicks.length > 0 && (
            <button className="reset-btn" onClick={resetSession}>
              {language === 'en' ? 'Reset' : 'Weka Upya'}
            </button>
          )}
        </div>
      </div>

      {insights && (
        <div className="insights-section">
          <h3>{language === 'en' ? 'Movement Insights' : 'Ufahamu wa Harakati'}</h3>
          <div className="insights-grid">
            <div className="insight-item">
              <div className="insight-value">{insights.totalToday}</div>
              <div className="insight-label">
                {language === 'en' ? 'Kicks today' : 'Vuguvugu leo'}
              </div>
            </div>
            <div className="insight-item">
              <div className="insight-value">{insights.sessionCount}</div>
              <div className="insight-label">
                {language === 'en' ? 'This session' : 'Kikao hiki'}
              </div>
            </div>
            <div className="insight-item">
              <div className="insight-value">{insights.avgInterval} min</div>
              <div className="insight-label">
                {language === 'en' ? 'Avg interval' : 'Muda wa wastani'}
              </div>
            </div>
          </div>

          {insights.pattern === 'quiet' && (
            <div className="alert-card">
              <span className="alert-icon">
                <Icons.warning size={24} />
              </span>
              <p>
                {language === 'en' 
                  ? 'Your baby\'s movements seem quieter than usual. If you\'re concerned, contact your healthcare provider.'
                  : 'Harakati za mtoto wako zinaonekana kimya kuliko kawaida. Ikiwa una wasiwasi, wasiliana na mhudumu wako wa afya.'}
              </p>
            </div>
          )}
        </div>
      )}

      {kicks.length > 0 && (
        <div className="history-section">
          <h3>{language === 'en' ? 'Recent Kicks' : 'Vuguvugu vya Hivi Karibuni'}</h3>
          <div className="kick-list">
            {kicks.slice(-10).reverse().map((kick, index) => (
              <div key={index} className="kick-item">
                <span className="kick-time">
                  {new Date(kick.time).toLocaleTimeString(language === 'en' ? 'en-US' : 'sw-KE', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <span className="kick-session-time">
                  {kick.sessionTime > 0 ? `+${formatTime(kick.sessionTime)}` : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KickCounter;

