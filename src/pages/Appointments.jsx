import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getTranslation } from '../utils/language';
import { userDataAPI } from '../utils/userDataAPI';
import { Icons } from '../components/Icons';
import './Appointments.css';

const Appointments = () => {
  const { language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const t = (key) => getTranslation(key, language);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    type: 'routine',
    provider: '',
    location: '',
    notes: '',
    questions: []
  });

  const [newQuestion, setNewQuestion] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadAppointments();
    } else {
      const saved = localStorage.getItem('appointments');
      if (saved) {
        setAppointments(JSON.parse(saved));
      }
      setLoading(false);
    }
  }, [isAuthenticated]);

  const appointmentTypes = {
    en: {
      routine: 'Routine Check-up',
      ultrasound: 'Ultrasound',
      lab: 'Lab Work',
      consultation: 'Consultation',
      other: 'Other'
    },
    sw: {
      routine: 'Ukaguzi wa Kawaida',
      ultrasound: 'Ultrasound',
      lab: 'Kazi ya Maabara',
      consultation: 'Mazungumzo',
      other: 'Nyingine'
    }
  };

  const suggestedQuestions = {
    en: [
      'How is my baby growing?',
      'Are there any concerns I should be aware of?',
      'What should I expect in the coming weeks?',
      'Are my symptoms normal?',
      'What tests do I need?',
      'What should I do if I have concerns?'
    ],
    sw: [
      'Mtoto wangu anaendelea vipi?',
      'Kuna wasiwasi wowote ninapaswa kujua?',
      'Nini ninapaswa kutarajia katika wiki zijazo?',
      'Dalili zangu ni za kawaida?',
      'Ni vipimo gani ninahitaji?',
      'Nifanye nini ikiwa nina wasiwasi?'
    ]
  };

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await userDataAPI.getAppointments();
      if (response.success) {
        setAppointments(response.appointments);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isAuthenticated) {
      try {
        if (selectedAppointment) {
          // Update existing
          await userDataAPI.updateAppointment(selectedAppointment._id, formData);
        } else {
          // Create new
          await userDataAPI.createAppointment(formData);
        }
        await loadAppointments();
      } catch (error) {
        console.error('Error saving appointment:', error);
        return;
      }
    } else {
      // Fallback to localStorage
      if (selectedAppointment) {
        const updated = appointments.map(apt => 
          apt.id === selectedAppointment.id ? { ...formData, id: apt.id } : apt
        );
        setAppointments(updated);
        localStorage.setItem('appointments', JSON.stringify(updated));
      } else {
        const newAppt = {
          ...formData,
          id: Date.now()
        };
        const updated = [...appointments, newAppt].sort((a, b) => 
          new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time)
        );
        setAppointments(updated);
        localStorage.setItem('appointments', JSON.stringify(updated));
      }
    }
    
    setShowForm(false);
    setSelectedAppointment(null);
    setFormData({
      date: '',
      time: '',
      type: 'routine',
      provider: '',
      location: '',
      notes: '',
      questions: []
    });
  };

  const handleDelete = async (id) => {
    if (isAuthenticated) {
      try {
        await userDataAPI.deleteAppointment(id);
        await loadAppointments();
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    } else {
      const updated = appointments.filter(apt => apt.id !== id);
      setAppointments(updated);
      localStorage.setItem('appointments', JSON.stringify(updated));
    }
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      date: appointment.date,
      time: appointment.time,
      type: appointment.type,
      provider: appointment.provider || '',
      location: appointment.location || '',
      notes: appointment.notes || '',
      questions: appointment.questions || []
    });
    setShowForm(true);
  };

  const addQuestion = () => {
    if (newQuestion.trim()) {
      setFormData({
        ...formData,
        questions: [...formData.questions, newQuestion.trim()]
      });
      setNewQuestion('');
    }
  };

  const removeQuestion = (index) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index)
    });
  };

  const upcomingAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date + ' ' + apt.time);
    return aptDate >= new Date();
  }).sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));

  const pastAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date + ' ' + apt.time);
    return aptDate < new Date();
  }).sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time));

  return (
    <div className="appointments">
      <div className="appointments-header">
        <h2>{language === 'en' ? 'Appointment Management' : 'Usimamizi wa Miadi'}</h2>
        <button className="add-appointment-btn" onClick={() => setShowForm(true)}>
          + {language === 'en' ? 'Add Appointment' : 'Ongeza Miadi'}
        </button>
      </div>

      {showForm && (
        <div className="appointment-form-overlay">
          <div className="appointment-form-card">
            <h3>{selectedAppointment ? (language === 'en' ? 'Edit Appointment' : 'Hariri Miadi') : (language === 'en' ? 'New Appointment' : 'Miadi Mpya')}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>{language === 'en' ? 'Date' : 'Tarehe'} *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{language === 'en' ? 'Time' : 'Muda'} *</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>{language === 'en' ? 'Appointment Type' : 'Aina ya Miadi'}</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  {Object.keys(appointmentTypes.en).map(type => (
                    <option key={type} value={type}>
                      {appointmentTypes[language][type]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>{language === 'en' ? 'Healthcare Provider' : 'Mhudumu wa Afya'}</label>
                <input
                  type="text"
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  placeholder={language === 'en' ? 'Dr. Name or Clinic' : 'Jina la Daktari au Kliniki'}
                />
              </div>

              <div className="form-group">
                <label>{language === 'en' ? 'Location' : 'Eneo'}</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder={language === 'en' ? 'Clinic address' : 'Anwani ya kliniki'}
                />
              </div>

              <div className="form-group">
                <label>{language === 'en' ? 'Questions to Ask' : 'Maswali ya Kuuliza'}</label>
                <div className="questions-input">
                  <input
                    type="text"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addQuestion())}
                    placeholder={language === 'en' ? 'Add a question...' : 'Ongeza swali...'}
                  />
                  <button type="button" onClick={addQuestion} className="add-question-btn">
                    +
                  </button>
                </div>
                <div className="suggested-questions">
                  <small>{language === 'en' ? 'Suggested questions:' : 'Maswali yaliyopendekezwa:'}</small>
                  <div className="suggested-list">
                    {suggestedQuestions[language].slice(0, 3).map((q, i) => (
                      <button
                        key={i}
                        type="button"
                        className="suggested-btn"
                        onClick={() => setNewQuestion(q)}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
                {formData.questions.length > 0 && (
                  <div className="questions-list">
                    {formData.questions.map((q, index) => (
                      <div key={index} className="question-item">
                        <span>{q}</span>
                        <button
                          type="button"
                          onClick={() => removeQuestion(index)}
                          className="remove-question-btn"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>{language === 'en' ? 'Notes' : 'Maelezo'}</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="4"
                  placeholder={language === 'en' ? 'Appointment notes...' : 'Maelezo ya miadi...'}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {language === 'en' ? 'Save Appointment' : 'Hifadhi Miadi'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedAppointment(null);
                    setFormData({
                      date: '',
                      time: '',
                      type: 'routine',
                      provider: '',
                      location: '',
                      notes: '',
                      questions: []
                    });
                  }}
                  className="cancel-btn"
                >
                  {language === 'en' ? 'Cancel' : 'Ghairi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {upcomingAppointments.length > 0 && (
        <div className="appointments-section">
          <h3>{language === 'en' ? 'Upcoming Appointments' : 'Miadi Inayokuja'}</h3>
          <div className="appointments-list">
            {upcomingAppointments.map(appointment => (
              <div key={appointment.id} className="appointment-card">
                <div className="appointment-header">
                  <div className="appointment-date">
                    <div className="date-display">
                      {new Date(appointment.date).toLocaleDateString(language === 'en' ? 'en-US' : 'sw-KE', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="time-display">{appointment.time}</div>
                  </div>
                  <div className="appointment-actions">
                    <button onClick={() => handleEdit(appointment)} className="edit-btn">
                      {language === 'en' ? 'Edit' : 'Hariri'}
                    </button>
                    <button onClick={() => handleDelete(appointment._id || appointment.id)} className="delete-btn">
                      {language === 'en' ? 'Delete' : 'Futa'}
                    </button>
                  </div>
                </div>
                <div className="appointment-details">
                  <div className="detail-item">
                    <strong>{appointmentTypes[language][appointment.type]}</strong>
                  </div>
                  {appointment.provider && (
                    <div className="detail-item">
                      {language === 'en' ? 'Provider:' : 'Mhudumu:'} {appointment.provider}
                    </div>
                  )}
                  {appointment.location && (
                    <div className="detail-item">
                      <Icons.location size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                      {appointment.location}
                    </div>
                  )}
                  {appointment.questions.length > 0 && (
                    <div className="detail-item">
                      <strong>{language === 'en' ? 'Questions to ask:' : 'Maswali ya kuuliza:'}</strong>
                      <ul className="questions-list-small">
                        {appointment.questions.map((q, i) => (
                          <li key={i}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {appointment.notes && (
                    <div className="detail-item notes">
                      <strong>{language === 'en' ? 'Notes:' : 'Maelezo:'}</strong>
                      <p>{appointment.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pastAppointments.length > 0 && (
        <div className="appointments-section">
          <h3>{language === 'en' ? 'Past Appointments' : 'Miadi Iliyopita'}</h3>
          <div className="appointments-list">
            {pastAppointments.map(appointment => (
              <div key={appointment.id} className="appointment-card past">
                <div className="appointment-header">
                  <div className="appointment-date">
                    <div className="date-display">
                      {new Date(appointment.date).toLocaleDateString(language === 'en' ? 'en-US' : 'sw-KE', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="time-display">{appointment.time}</div>
                  </div>
                </div>
                <div className="appointment-details">
                  <div className="detail-item">
                    <strong>{appointmentTypes[language][appointment.type]}</strong>
                  </div>
                  {appointment.notes && (
                    <div className="detail-item notes">
                      <strong>{language === 'en' ? 'Notes:' : 'Maelezo:'}</strong>
                      <p>{appointment.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {appointments.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">
            <Icons.calendar size={48} />
          </div>
          <p>{language === 'en' 
            ? 'No appointments scheduled. Add your first appointment to get started!'
            : 'Hakuna miadi iliyopangwa. Ongeza miadi yako ya kwanza kuanza!'}</p>
        </div>
      )}
    </div>
  );
};

export default Appointments;

