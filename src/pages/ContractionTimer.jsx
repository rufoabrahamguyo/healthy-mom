import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getTranslation } from '../utils/language';
import { userDataAPI } from '../utils/userDataAPI';
import { Icons } from '../components/Icons';
import './ContractionTimer.css';

const ContractionTimer = () => {
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const t = (key) => getTranslation(key, language);

  const [contractions, setContractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [currentStart, setCurrentStart] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadContractions();
    } else {
      const saved = localStorage.getItem('contractionHistory');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Normalize localStorage data to match API format
          const normalized = parsed.map(c => ({
            startTime: typeof c.startTime === 'string' ? new Date(c.startTime).getTime() : c.startTime,
            endTime: typeof c.endTime === 'string' ? new Date(c.endTime).getTime() : c.endTime,
            duration: c.duration || 0,
            time: c.time || new Date(c.startTime).toISOString()
          }));
          setContractions(normalized);
        } catch (error) {
          console.error('Error parsing contraction history:', error);
          setContractions([]);
        }
      }
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isActive && currentStart) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - currentStart) / 1000));
      }, 100);
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
  }, [isActive, currentStart]);

  const startContraction = () => {
    setIsActive(true);
    setCurrentStart(Date.now());
    setElapsedTime(0);
  };

  const loadContractions = async () => {
    try {
      setLoading(true);
      const response = await userDataAPI.getContractions();
      if (response.success && response.contractions) {
        const normalized = response.contractions.map(c => ({
          startTime: typeof c.startTime === 'string' ? new Date(c.startTime).getTime() : c.startTime,
          endTime: typeof c.endTime === 'string' ? new Date(c.endTime).getTime() : c.endTime,
          duration: c.duration || 0,
          time: c.startTime || c.time || new Date().toISOString()
        }));
        setContractions(normalized);
      } else {
        setContractions([]);
      }
    } catch (error) {
      console.error('Error loading contractions:', error);
      // Fallback to localStorage if API fails
      const saved = localStorage.getItem('contractionHistory');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const normalized = parsed.map(c => ({
            startTime: typeof c.startTime === 'string' ? new Date(c.startTime).getTime() : c.startTime,
            endTime: typeof c.endTime === 'string' ? new Date(c.endTime).getTime() : c.endTime,
            duration: c.duration || 0,
            time: c.time || new Date(c.startTime).toISOString()
          }));
          setContractions(normalized);
        } catch (parseError) {
          console.error('Error parsing localStorage contractions:', parseError);
          setContractions([]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const stopContraction = async () => {
    if (!isActive || !currentStart) return;

    const duration = Math.floor((Date.now() - currentStart) / 1000);
    const newContraction = {
      startTime: currentStart,
      endTime: Date.now(),
      duration,
      time: new Date().toISOString()
    };

    // Always update local state immediately for better UX
    const updated = [...contractions, newContraction];
    setContractions(updated);

    if (isAuthenticated) {
      try {
        await userDataAPI.saveContraction({
          startTime: new Date(newContraction.startTime).toISOString(),
          endTime: new Date(newContraction.endTime).toISOString(),
          duration: newContraction.duration
        });
        await loadContractions();
      } catch (error) {
        console.error('Error saving contraction:', error);
        // Fallback to localStorage if API fails
        localStorage.setItem('contractionHistory', JSON.stringify(updated));
      }
    } else {
      localStorage.setItem('contractionHistory', JSON.stringify(updated));
    }

    setIsActive(false);
    setCurrentStart(null);
    setElapsedTime(0);
  };

  const resetHistory = async () => {
    if (isAuthenticated) {
      try {
        await userDataAPI.clearContractions();
        await loadContractions();
      } catch (error) {
        console.error('Error clearing contractions:', error);
      }
    } else {
      setContractions([]);
      localStorage.removeItem('contractionHistory');
    }
    setIsActive(false);
    setCurrentStart(null);
    setElapsedTime(0);
  };

  const getPatternAnalysis = () => {
    if (contractions.length < 2) return null;

    const recent = contractions.slice(-5);
    const intervals = [];
    for (let i = 1; i < recent.length; i++) {
      intervals.push((recent[i].startTime - recent[i - 1].startTime) / 1000 / 60); // minutes
    }

    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const avgDuration = recent.reduce((sum, c) => sum + c.duration, 0) / recent.length / 60; // minutes

    let status = 'early';
    let message = language === 'en' 
      ? 'Your contractions are irregular. Continue timing them.'
      : 'Mikazo yako haijawa ya kawaida. Endelea kuhesabu.';

    if (avgInterval <= 5 && avgDuration >= 0.5) {
      status = 'active';
      message = language === 'en'
        ? 'Your contractions are getting closer together. You may want to prepare to go to your chosen hospital.'
        : 'Mikazo yako inakaribia zaidi. Unaweza kutayarisha kwenda hospitalini.';
    } else if (avgInterval <= 10 && avgDuration >= 0.5) {
      status = 'progressing';
      message = language === 'en'
        ? 'Your contractions are becoming more regular. Keep timing them.'
        : 'Mikazo yako inakuwa ya kawaida zaidi. Endelea kuhesabu.';
    }

    return {
      avgInterval: avgInterval.toFixed(1),
      avgDuration: avgDuration.toFixed(1),
      status,
      message,
      count: recent.length
    };
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const analysis = getPatternAnalysis();
  const lastContraction = contractions[contractions.length - 1];
  const timeSinceLast = lastContraction 
    ? Math.floor((Date.now() - lastContraction.endTime) / 1000 / 60)
    : null;

  return (
    <div className="contraction-timer">
      <h2>{language === 'en' ? 'Contraction Timer' : 'Kipima Muda cha Mikazo'}</h2>

      <div className="info-card">
        <p>
          {language === 'en'
            ? 'Time your contractions to track their frequency and duration. Contact your healthcare provider if contractions are less than 5 minutes apart and lasting more than 45 seconds.'
            : 'Pima muda wa mikazo yako ili kufuatilia mara yake na muda wake. Wasiliana na mhudumu wako wa afya ikiwa mikazo ni chini ya dakika 5 na inaendelea zaidi ya sekunde 45.'}
        </p>
      </div>

      <div className="timer-section">
        {isActive ? (
          <div className="active-timer">
            <div className="timer-display">{formatTime(elapsedTime)}</div>
            <div className="timer-label">
              {language === 'en' ? 'Contraction in progress' : 'Mkazo unaendelea'}
            </div>
            <button className="stop-contraction-btn" onClick={stopContraction}>
              {language === 'en' ? 'Stop Contraction' : 'Acha Mkazo'}
            </button>
          </div>
        ) : (
          <div className="ready-timer">
            <div className="timer-display">00:00</div>
            <div className="timer-label">
              {language === 'en' ? 'Ready to time contraction' : 'Tayari kupima mkazo'}
            </div>
            <button className="start-contraction-btn" onClick={startContraction}>
              {language === 'en' ? 'Start Contraction' : 'Anza Mkazo'}
            </button>
          </div>
        )}
      </div>

      {contractions.length > 0 && (
        <>
          <div className="stats-section">
            <div className="stat-card">
              <div className="stat-value">{contractions.length}</div>
              <div className="stat-label">
                {language === 'en' ? 'Total Contractions' : 'Jumla ya Mikazo'}
              </div>
            </div>
            {lastContraction && (
              <div className="stat-card">
                <div className="stat-value">{formatTime(lastContraction.duration)}</div>
                <div className="stat-label">
                  {language === 'en' ? 'Last Duration' : 'Muda wa Mwisho'}
                </div>
              </div>
            )}
            {timeSinceLast !== null && (
              <div className="stat-card">
                <div className="stat-value">{timeSinceLast} min</div>
                <div className="stat-label">
                  {language === 'en' ? 'Time Since Last' : 'Muda Tangu ya Mwisho'}
                </div>
              </div>
            )}
          </div>

          {analysis && (
            <div className={`analysis-section ${analysis.status}`}>
              <h3>{language === 'en' ? 'Pattern Analysis' : 'Uchambuzi wa Mfumo'}</h3>
              <div className="analysis-grid">
                <div className="analysis-item">
                  <div className="analysis-value">{analysis.avgInterval} min</div>
                  <div className="analysis-label">
                    {language === 'en' ? 'Avg Interval' : 'Muda wa Wastani'}
                  </div>
                </div>
                <div className="analysis-item">
                  <div className="analysis-value">{analysis.avgDuration} min</div>
                  <div className="analysis-label">
                    {language === 'en' ? 'Avg Duration' : 'Muda wa Wastani'}
                  </div>
                </div>
              </div>
              <div className={`analysis-message ${analysis.status}`}>
                {analysis.status === 'active' && (
                  <Icons.warning size={18} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                )}
                {analysis.message}
              </div>
            </div>
          )}

          <div className="history-section">
            <div className="history-header">
              <h3>{language === 'en' ? 'Contraction History' : 'Historia ya Mikazo'}</h3>
              <button className="reset-btn" onClick={resetHistory}>
                {language === 'en' ? 'Reset' : 'Weka Upya'}
              </button>
            </div>
            <div className="contraction-list">
              {contractions.slice(-10).reverse().map((contraction, index) => {
                // Calculate interval from previous contraction
                const reversedList = contractions.slice(-10).reverse();
                const interval = index > 0 && reversedList[index - 1]
                  ? Math.floor((contraction.startTime - reversedList[index - 1].endTime) / 1000 / 60)
                  : null;
                
                // Ensure startTime is a valid timestamp
                const startTime = typeof contraction.startTime === 'number' 
                  ? contraction.startTime 
                  : new Date(contraction.startTime).getTime();
                
                return (
                  <div key={`${contraction.startTime}-${index}`} className="contraction-item">
                    <div className="contraction-time">
                      {new Date(startTime).toLocaleTimeString(language === 'en' ? 'en-US' : 'sw-KE', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </div>
                    <div className="contraction-details">
                      <span className="duration">
                        {formatTime(contraction.duration || 0)}
                      </span>
                      {interval !== null && interval >= 0 && (
                        <span className="interval">
                          {language === 'en' ? `${interval} min since previous` : `${interval} dakika tangu ya awali`}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ContractionTimer;

