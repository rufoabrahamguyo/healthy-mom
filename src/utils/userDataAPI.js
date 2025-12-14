// API functions for saving user data to MongoDB
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const getToken = () => {
  return localStorage.getItem('authToken');
};

const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(text || `Request failed with status ${response.status}`);
    }

    if (!response.ok) {
      throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Could not connect to server.');
    }
    throw error;
  }
};

export const userDataAPI = {
  // Save user data (mood, kicks, appointments, etc.)
  saveData: async (dataType, data) => {
    return apiRequest('/user/data', {
      method: 'POST',
      body: JSON.stringify({ dataType, data }),
    });
  },

  // Get specific data type
  getData: async (dataType) => {
    return apiRequest(`/user/data/${dataType}`);
  },

  // Get all user data
  getAllData: async () => {
    return apiRequest('/user/data');
  },

  // Kicks-specific methods
  getKicks: async () => {
    try {
      const response = await apiRequest('/user/data/kicks');
      if (response.success && response.data && response.data.sessions) {
        // Flatten sessions array into individual kicks
        const allKicks = [];
        response.data.sessions.forEach(session => {
          if (session.kicks && Array.isArray(session.kicks)) {
            session.kicks.forEach(kick => {
              allKicks.push({
                time: new Date(kick.time || session.date).getTime(),
                sessionTime: kick.sessionTime || session.duration || 0
              });
            });
          }
        });
        return { success: true, kicks: allKicks };
      }
      return { success: true, kicks: [] };
    } catch (error) {
      console.error('Error getting kicks:', error);
      return { success: false, kicks: [] };
    }
  },

  saveKick: async (kickData) => {
    try {
      // Get existing kicks data
      const existingResponse = await apiRequest('/user/data/kicks');
      const existingData = existingResponse.success && existingResponse.data 
        ? existingResponse.data 
        : { sessions: [] };

      // Find or create today's session
      const today = new Date().toISOString().split('T')[0];
      let todaySession = existingData.sessions.find(s => s.date === today);

      if (!todaySession) {
        todaySession = {
          date: today,
          kicks: [],
          duration: 0
        };
        existingData.sessions.push(todaySession);
      }

      // Add the new kick
      if (!todaySession.kicks) {
        todaySession.kicks = [];
      }
      todaySession.kicks.push({
        time: kickData.time,
        sessionTime: kickData.sessionTime || 0
      });

      // Update session duration if needed
      if (kickData.sessionTime > todaySession.duration) {
        todaySession.duration = kickData.sessionTime;
      }

      // Save updated data
      return await apiRequest('/user/data', {
        method: 'POST',
        body: JSON.stringify({ 
          dataType: 'kicks', 
          data: existingData 
        }),
      });
    } catch (error) {
      console.error('Error saving kick:', error);
      throw error;
    }
  },

  clearKicks: async () => {
    return apiRequest('/user/data', {
      method: 'POST',
      body: JSON.stringify({ 
        dataType: 'kicks', 
        data: { sessions: [] } 
      }),
    });
  },

  // Contractions methods
  getContractions: async () => {
    try {
      const response = await apiRequest('/user/data/contractions');
      if (response.success && response.data && response.data.entries) {
        return { success: true, contractions: response.data.entries };
      }
      return { success: true, contractions: [] };
    } catch (error) {
      console.error('Error getting contractions:', error);
      return { success: false, contractions: [] };
    }
  },

  saveContraction: async (contractionData) => {
    try {
      const existingResponse = await apiRequest('/user/data/contractions');
      const existingData = existingResponse.success && existingResponse.data 
        ? existingResponse.data 
        : { entries: [] };

      existingData.entries.push({
        startTime: contractionData.startTime,
        endTime: contractionData.endTime,
        duration: contractionData.duration
      });

      return await apiRequest('/user/data', {
        method: 'POST',
        body: JSON.stringify({ 
          dataType: 'contractions', 
          data: existingData 
        }),
      });
    } catch (error) {
      console.error('Error saving contraction:', error);
      throw error;
    }
  },

  clearContractions: async () => {
    return apiRequest('/user/data', {
      method: 'POST',
      body: JSON.stringify({ 
        dataType: 'contractions', 
        data: { entries: [] } 
      }),
    });
  },

  // Appointments methods
  getAppointments: async () => {
    try {
      const response = await apiRequest('/user/data/appointments');
      if (response.success && response.data && response.data.entries) {
        return { success: true, appointments: response.data.entries };
      }
      return { success: true, appointments: [] };
    } catch (error) {
      console.error('Error getting appointments:', error);
      return { success: false, appointments: [] };
    }
  },

  createAppointment: async (appointmentData) => {
    try {
      const existingResponse = await apiRequest('/user/data/appointments');
      const existingData = existingResponse.success && existingResponse.data 
        ? existingResponse.data 
        : { entries: [] };

      const newAppointment = {
        ...appointmentData,
        _id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };

      existingData.entries.push(newAppointment);

      return await apiRequest('/user/data', {
        method: 'POST',
        body: JSON.stringify({ 
          dataType: 'appointments', 
          data: existingData 
        }),
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  updateAppointment: async (id, appointmentData) => {
    try {
      const existingResponse = await apiRequest('/user/data/appointments');
      const existingData = existingResponse.success && existingResponse.data 
        ? existingResponse.data 
        : { entries: [] };

      const updatedEntries = existingData.entries.map(apt => 
        apt._id === id ? { ...appointmentData, _id: id } : apt
      );

      return await apiRequest('/user/data', {
        method: 'POST',
        body: JSON.stringify({ 
          dataType: 'appointments', 
          data: { entries: updatedEntries } 
        }),
      });
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  },

  deleteAppointment: async (id) => {
    try {
      const existingResponse = await apiRequest('/user/data/appointments');
      const existingData = existingResponse.success && existingResponse.data 
        ? existingResponse.data 
        : { entries: [] };

      const filteredEntries = existingData.entries.filter(apt => apt._id !== id);

      return await apiRequest('/user/data', {
        method: 'POST',
        body: JSON.stringify({ 
          dataType: 'appointments', 
          data: { entries: filteredEntries } 
        }),
      });
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  },

  // Checklists methods
  getChecklists: async () => {
    try {
      const response = await apiRequest('/user/data/babyPrep');
      if (response.success && response.data) {
        const checklists = [];
        if (response.data.hospitalBag) {
          response.data.hospitalBag.forEach(cat => {
            checklists.push({ ...cat, type: 'hospitalBag' });
          });
        }
        if (response.data.nursery) {
          response.data.nursery.forEach(cat => {
            checklists.push({ ...cat, type: 'nursery' });
          });
        }
        return { success: true, checklists };
      }
      return { success: true, checklists: [] };
    } catch (error) {
      console.error('Error getting checklists:', error);
      return { success: false, checklists: [] };
    }
  },

  saveChecklist: async (checklistData) => {
    try {
      const existingResponse = await apiRequest('/user/data/babyPrep');
      const existingData = existingResponse.success && existingResponse.data 
        ? existingResponse.data 
        : { hospitalBag: [], nursery: [] };

      const type = checklistData.type;
      const category = checklistData.category;
      const items = checklistData.items;

      if (type === 'hospitalBag') {
        const existingIndex = existingData.hospitalBag.findIndex(cat => cat.category === category);
        if (existingIndex >= 0) {
          existingData.hospitalBag[existingIndex].items = items;
        } else {
          existingData.hospitalBag.push({ category, items });
        }
      } else if (type === 'nursery') {
        const existingIndex = existingData.nursery.findIndex(cat => cat.category === category);
        if (existingIndex >= 0) {
          existingData.nursery[existingIndex].items = items;
        } else {
          existingData.nursery.push({ category, items });
        }
      }

      return await apiRequest('/user/data', {
        method: 'POST',
        body: JSON.stringify({ 
          dataType: 'babyPrep', 
          data: existingData 
        }),
      });
    } catch (error) {
      console.error('Error saving checklist:', error);
      throw error;
    }
  },

  // Reminders methods
  updateReminder: async (id, reminderData) => {
    try {
      const existingResponse = await apiRequest('/user/data/reminders');
      const existingData = existingResponse.success && existingResponse.data 
        ? existingResponse.data 
        : { entries: [] };

      const updatedEntries = existingData.entries.map(rem => 
        (rem._id === id || rem.id === id) ? reminderData : rem
      );

      return await apiRequest('/user/data', {
        method: 'POST',
        body: JSON.stringify({ 
          dataType: 'reminders', 
          data: { entries: updatedEntries } 
        }),
      });
    } catch (error) {
      console.error('Error updating reminder:', error);
      throw error;
    }
  },
};

export default userDataAPI;
