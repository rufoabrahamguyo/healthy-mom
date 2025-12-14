import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getTranslation } from '../utils/language';
import { forumAPI } from '../utils/api';
import { Icons } from '../components/Icons';
import './Forum.css';

const Forum = () => {
  const { language } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const t = (key) => getTranslation(key, language);
  
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newQuestion, setNewQuestion] = useState('');
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [posting, setPosting] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editText, setEditText] = useState('');
  const [commentTexts, setCommentTexts] = useState({});
  const [showCommentForm, setShowCommentForm] = useState({});

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await forumAPI.getQuestions();
      if (response.success) {
        setQuestions(response.questions || []);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      // Fallback to localStorage if API fails
      const saved = localStorage.getItem('forumQuestions');
      if (saved) {
        setQuestions(JSON.parse(saved));
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePostQuestion = async () => {
    if (!newQuestion.trim()) {
      setError(language === 'en' ? 'Please share your experience or ask a question' : 'Tafadhali shiriki uzoefu wako au uliza swali');
      return;
    }

    setError('');
    setSuccess('');
    setPosting(true);

    if (isAuthenticated) {
      try {
        const response = await forumAPI.createQuestion({
          question: newQuestion,
          questionSwahili: language === 'sw' ? newQuestion : '',
          anonymous: true
        });
        
        if (response.success) {
          setSuccess(language === 'en' ? 'Post shared successfully!' : 'Uchapisho umeshirikiwa kwa mafanikio!');
          await loadQuestions();
          setNewQuestion('');
          setShowQuestionForm(false);
          setTimeout(() => setSuccess(''), 3000);
        } else {
          setError(response.message || (language === 'en' ? 'Failed to post question' : 'Imeshindwa kuchapisha swali'));
        }
      } catch (error) {
        console.error('Error posting question:', error);
        setError(error.message || (language === 'en' ? 'Failed to post question. Please try again.' : 'Imeshindwa kuchapisha swali. Tafadhali jaribu tena.'));
        // Fallback to localStorage if API fails
        const question = {
          id: Date.now(),
          _id: Date.now().toString(),
          question: newQuestion,
          answers: [],
          anonymous: true,
          userId: user?._id || user?.id,
          timestamp: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };
        const updated = [question, ...questions];
        setQuestions(updated);
        localStorage.setItem('forumQuestions', JSON.stringify(updated));
        setNewQuestion('');
        setShowQuestionForm(false);
        setSuccess(language === 'en' ? 'Post saved locally!' : 'Uchapisho umehifadhiwa ndani!');
        setTimeout(() => setSuccess(''), 3000);
      } finally {
        setPosting(false);
      }
    } else {
      // Fallback to localStorage
      const question = {
        id: Date.now(),
        _id: Date.now().toString(),
        question: newQuestion,
        answers: [],
        anonymous: true,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      const updated = [question, ...questions];
      setQuestions(updated);
      localStorage.setItem('forumQuestions', JSON.stringify(updated));
      setNewQuestion('');
      setShowQuestionForm(false);
      setSuccess(language === 'en' ? 'Post shared!' : 'Uchapisho umeshirikiwa!');
      setTimeout(() => setSuccess(''), 3000);
      setPosting(false);
    }
  };

  const handleEditPost = (post) => {
    setEditingPostId(post._id || post.id);
    setEditText(post.question);
  };

  const handleSaveEdit = async (postId) => {
    if (!editText.trim()) {
      setError(language === 'en' ? 'Please enter some text' : 'Tafadhali ingiza maandishi');
      return;
    }

    try {
      if (isAuthenticated) {
        const response = await forumAPI.updateQuestion(postId, {
          question: editText,
          questionSwahili: language === 'sw' ? editText : ''
        });
        
        if (response.success) {
          await loadQuestions();
          setEditingPostId(null);
          setEditText('');
          setSuccess(language === 'en' ? 'Post updated successfully!' : 'Uchapisho umehakikiwa kwa mafanikio!');
          setTimeout(() => setSuccess(''), 3000);
        }
      } else {
        // Fallback to localStorage
        const updated = questions.map(q => 
          (q._id === postId || q.id === postId) 
            ? { ...q, question: editText }
            : q
        );
        setQuestions(updated);
        localStorage.setItem('forumQuestions', JSON.stringify(updated));
        setEditingPostId(null);
        setEditText('');
        setSuccess(language === 'en' ? 'Post updated!' : 'Uchapisho umehakikiwa!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Error updating post:', error);
      setError(language === 'en' ? 'Failed to update post' : 'Imeshindwa kuhakiki uchapisho');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm(language === 'en' 
      ? 'Are you sure you want to delete this post?' 
      : 'Je, una uhakika unataka kufuta uchapisho huu?')) {
      return;
    }

    try {
      if (isAuthenticated) {
        const response = await forumAPI.deleteQuestion(postId);
        if (response.success) {
          await loadQuestions();
          setSuccess(language === 'en' ? 'Post deleted successfully!' : 'Uchapisho umefutwa kwa mafanikio!');
          setTimeout(() => setSuccess(''), 3000);
        }
      } else {
        // Fallback to localStorage
        const updated = questions.filter(q => q._id !== postId && q.id !== postId);
        setQuestions(updated);
        localStorage.setItem('forumQuestions', JSON.stringify(updated));
        setSuccess(language === 'en' ? 'Post deleted!' : 'Uchapisho umefutwa!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      setError(language === 'en' ? 'Failed to delete post' : 'Imeshindwa kufuta uchapisho');
    }
  };

  const handleAddComment = async (postId) => {
    const commentText = commentTexts[postId] || '';
    if (!commentText.trim()) {
      setError(language === 'en' ? 'Please enter a comment' : 'Tafadhali ingiza maoni');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setError('');
    setSuccess('');

    // Helper function to save comment to localStorage
    const saveCommentLocally = () => {
      const updated = questions.map(q => {
        if (q._id === postId || q.id === postId) {
          const newAnswer = {
            id: Date.now(),
            _id: Date.now().toString(),
            text: commentText,
            answeredBy: isAuthenticated ? (user?.name || 'Anonymous') : 'Anonymous',
            verified: false,
            createdAt: new Date().toISOString()
          };
          return {
            ...q,
            answers: [...(q.answers || []), newAnswer]
          };
        }
        return q;
      });
      setQuestions(updated);
      localStorage.setItem('forumQuestions', JSON.stringify(updated));
      setCommentTexts({ ...commentTexts, [postId]: '' });
      setShowCommentForm({ ...showCommentForm, [postId]: false });
      setSuccess(language === 'en' ? 'Comment added!' : 'Maoni yameongezwa!');
      setTimeout(() => setSuccess(''), 3000);
    };

    try {
      if (isAuthenticated) {
        try {
          const response = await forumAPI.addAnswer(postId, {
            text: commentText,
            textSwahili: language === 'sw' ? commentText : '',
            answeredBy: user?.name || 'Anonymous',
            answeredBySwahili: language === 'sw' ? (user?.name || 'Bila Jina') : '',
            verified: false
          });
          
          if (response && response.success) {
            await loadQuestions();
            setCommentTexts({ ...commentTexts, [postId]: '' });
            setShowCommentForm({ ...showCommentForm, [postId]: false });
            setSuccess(language === 'en' ? 'Comment added successfully!' : 'Maoni yameongezwa kwa mafanikio!');
            setTimeout(() => setSuccess(''), 3000);
            return;
          }
        } catch (apiError) {
          console.error('API error, falling back to localStorage:', apiError);
          // Fallback to localStorage if API fails
          saveCommentLocally();
          return;
        }
        
        // If response is not successful, fallback to localStorage
        saveCommentLocally();
      } else {
        // Not authenticated, use localStorage
        saveCommentLocally();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      // Fallback to localStorage on any error
      try {
        saveCommentLocally();
      } catch (fallbackError) {
        setError(language === 'en' ? 'Failed to add comment. Please try again.' : 'Imeshindwa kuongeza maoni. Tafadhali jaribu tena.');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const isOwnPost = (post) => {
    if (!isAuthenticated || !user) return false;
    return post.userId === user._id || post.userId === user.id || 
           (post.userId && post.userId.toString() === (user._id || user.id)?.toString());
  };

  return (
    <div className="forum">
      <h2>{language === 'en' ? 'Community Forum' : 'Jukwaa la Jamii'}</h2>
      
      {error && (
        <div className="error-message" style={{ color: '#d32f2f', marginTop: '10px', padding: '10px', background: '#ffebee', borderRadius: '4px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}
      {success && (
        <div className="success-message" style={{ color: '#2e7d32', marginTop: '10px', padding: '10px', background: '#e8f5e9', borderRadius: '4px', marginBottom: '1rem' }}>
          {success}
        </div>
      )}
      
      <div className="forum-header">
        <p className="forum-description">
          {language === 'en' 
            ? "Share your experiences, ask questions, and connect with other expecting mothers. This is your safe space to learn from each other's journeys."
            : "Shiriki uzoefu wako, uliza maswali, na uungane na wanawake wengine wajawazito. Hii ni nafasi yako salama ya kujifunza kutoka kwa safari za kila mmoja."}
        </p>
        
        {!showQuestionForm ? (
          <button 
            className="ask-question-btn"
            onClick={() => setShowQuestionForm(true)}
          >
            {t('forum.askQuestion')}
          </button>
        ) : (
          <div className="question-form">
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder={t('forum.questionPlaceholder')}
              className="question-input"
              rows="4"
            />
            <div className="form-actions">
              <button 
                className="post-btn"
                onClick={handlePostQuestion}
                disabled={posting}
              >
                {posting ? (language === 'en' ? 'Posting...' : 'Inachapisha...') : t('forum.postQuestion')}
              </button>
              <button 
                className="cancel-btn"
                onClick={() => {
                  setShowQuestionForm(false);
                  setNewQuestion('');
                }}
              >
                {t('common.cancel')}
              </button>
            </div>
            <p className="anonymous-note">
              {t('forum.postAnonymously')}
            </p>
            {error && (
              <div className="error-message" style={{ color: '#d32f2f', marginTop: '10px', padding: '10px', background: '#ffebee', borderRadius: '4px' }}>
                {error}
              </div>
            )}
            {success && (
              <div className="success-message" style={{ color: '#2e7d32', marginTop: '10px', padding: '10px', background: '#e8f5e9', borderRadius: '4px' }}>
                {success}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="questions-list">
        <h3>{language === 'en' ? 'Recent Posts' : 'Machapisho ya Hivi Karibuni'}</h3>
        
        {questions.length === 0 ? (
          <p className="no-questions">{t('forum.noQuestions')}</p>
        ) : (
          questions.map(q => (
            <div key={q._id || q.id} className="question-card">
              <div className="question-header">
                <span className="anonymous-badge">
                  <Icons.user size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  {t('common.anonymous')}
                </span>
                <span className="question-time">
                  {new Date(q.timestamp || q.createdAt).toLocaleDateString()}
                </span>
                {isOwnPost(q) && (
                  <div className="post-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEditPost(q)}
                      title={language === 'en' ? 'Edit post' : 'Hariri uchapisho'}
                    >
                      <Icons.edit size={16} />
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeletePost(q._id || q.id)}
                      title={language === 'en' ? 'Delete post' : 'Futa uchapisho'}
                    >
                      <Icons.delete size={16} />
                    </button>
                  </div>
                )}
              </div>
              
              {editingPostId === (q._id || q.id) ? (
                <div className="edit-form">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="question-input"
                    rows="3"
                  />
                  <div className="edit-actions">
                    <button 
                      className="save-btn"
                      onClick={() => handleSaveEdit(q._id || q.id)}
                    >
                      {language === 'en' ? 'Save' : 'Hifadhi'}
                    </button>
                    <button 
                      className="cancel-btn"
                      onClick={() => {
                        setEditingPostId(null);
                        setEditText('');
                      }}
                    >
                      {language === 'en' ? 'Cancel' : 'Ghairi'}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="question-text">{q.question}</p>
              )}
              
              <div className="comment-section">
                {!showCommentForm[q._id || q.id] ? (
                  <button 
                    className="comment-btn"
                    onClick={() => setShowCommentForm({ ...showCommentForm, [q._id || q.id]: true })}
                  >
                    <Icons.comment size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    {language === 'en' ? 'Comment' : 'Maoni'}
                  </button>
                ) : (
                  <div className="comment-form">
                    <textarea
                      value={commentTexts[q._id || q.id] || ''}
                      onChange={(e) => setCommentTexts({ ...commentTexts, [q._id || q.id]: e.target.value })}
                      placeholder={language === 'en' ? 'Write a comment...' : 'Andika maoni...'}
                      className="comment-input"
                      rows="3"
                    />
                    <div className="comment-actions">
                      <button 
                        className="post-comment-btn"
                        onClick={() => handleAddComment(q._id || q.id)}
                      >
                        {language === 'en' ? 'Post Comment' : 'Chapisha Maoni'}
                      </button>
                      <button 
                        className="cancel-comment-btn"
                        onClick={() => {
                          setShowCommentForm({ ...showCommentForm, [q._id || q.id]: false });
                          setCommentTexts({ ...commentTexts, [q._id || q.id]: '' });
                        }}
                      >
                        {language === 'en' ? 'Cancel' : 'Ghairi'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {q.answers && q.answers.length > 0 ? (
                <div className="answers-section">
                  <h4>{language === 'en' ? 'Community Responses' : 'Majibu ya Jamii'} ({q.answers.length})</h4>
                  {q.answers.map((answer, idx) => (
                    <div key={answer._id || answer.id || idx} className="answer-card">
                      <div className="answer-header">
                        <span className="answer-author">
                          {answer.verified && <Icons.check size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />}
                          {answer.answeredBy || 'Anonymous'}
                        </span>
                        {answer.verified && (
                          <span className="verified-badge-small">
                            {language === 'en' ? 'Verified' : 'Imethibitishwa'}
                          </span>
                        )}
                      </div>
                      <p className="answer-text">{answer.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-answers">
                  {language === 'en' 
                    ? "No responses yet. Share your experience or wait for other community members to respond."
                    : "Hakuna majibu bado. Shiriki uzoefu wako au subiri wanajamii wengine wajibu."}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Forum;

