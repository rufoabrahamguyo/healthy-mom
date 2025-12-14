import { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/language';
import { healthArticles, getArticlesByCategory } from '../data/healthArticles';
import { Icons } from '../components/Icons';
import './HealthLibrary.css';

const HealthLibrary = () => {
  const { language } = useLanguage();
  const t = (key) => getTranslation(key, language);
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [playingArticleId, setPlayingArticleId] = useState(null);
  const utteranceRef = useRef(null);
  
  const categories = ['all', 'nutrition', 'symptoms', 'lifestyle', 'delivery'];
  
  const articles = selectedCategory && selectedCategory !== 'all'
    ? getArticlesByCategory(selectedCategory, language)
    : (healthArticles[language] || []);
  
  const filteredArticles = searchQuery
    ? articles.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : articles;

  const handlePlayAudio = (articleId, text) => {
    if (!('speechSynthesis' in window)) {
      alert(language === 'en' 
        ? 'Audio playback not supported on your device' 
        : 'Kucheza sauti haitumiki kwenye kifaa chako');
      return;
    }

    // If this article is already playing, stop it
    if (playingArticleId === articleId && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setPlayingArticleId(null);
      utteranceRef.current = null;
      return;
    }

    // Stop any currently playing audio
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    // Start playing this article
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'sw' ? 'sw-KE' : 'en-KE';
    utteranceRef.current = utterance;
    setPlayingArticleId(articleId);

    // Handle when speech ends
    utterance.onend = () => {
      setPlayingArticleId(null);
      utteranceRef.current = null;
    };

    // Handle errors
    utterance.onerror = () => {
      setPlayingArticleId(null);
      utteranceRef.current = null;
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="health-library">
      <h2>{t('library.title')}</h2>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder={t('common.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="categories">
        <h3>{t('library.categories')}</h3>
        <div className="category-buttons">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            >
              {t(`library.${category}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="articles-list">
        {filteredArticles.length === 0 ? (
          <p className="no-articles">
            {language === 'en' 
              ? 'No articles found. Try a different search.' 
              : 'Hakuna makala zilizopatikana. Jaribu utafutaji mwingine.'}
          </p>
        ) : (
          filteredArticles.map(article => (
            <article key={article.id} className="article-card">
              <h3>{article.title}</h3>
              <div className="article-meta">
                <span className="category-badge">{t(`library.${article.category.toLowerCase()}`)}</span>
              </div>
              <p className="article-content">{article.content}</p>
              
              {article.myth && article.truth && (
                <div className="myth-busting">
                  <div className="myth">
                    <strong>{t('library.mythBusting')}:</strong> {article.myth}
                  </div>
                  <div className="truth">
                    <strong>{language === 'en' ? 'Truth' : 'Kweli'}:</strong> {article.truth}
                  </div>
                </div>
              )}
              
              <button 
                className={`audio-btn ${playingArticleId === article.id ? 'playing' : ''}`}
                onClick={() => handlePlayAudio(article.id, `${article.title}. ${article.content}`)}
              >
                {playingArticleId === article.id ? (
                  <Icons.pause size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                ) : (
                  <Icons.audio size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                )}
                {playingArticleId === article.id 
                  ? (language === 'en' ? 'Stop Audio' : 'Acha Sauti')
                  : t('library.playAudio')
                }
              </button>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default HealthLibrary;

