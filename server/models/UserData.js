import mongoose from 'mongoose';

// Mood Entry Schema
const moodEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: String,
    required: true
  },
  mood: {
    type: String,
    required: true,
    enum: ['happy', 'calm', 'sad', 'anxious', 'tired', 'angry', 'nauseous', 'excited']
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Kick Entry Schema
const kickEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  time: {
    type: Date,
    required: true
  },
  sessionTime: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Contraction Schema
const contractionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true // in seconds
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Appointment Schema
const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['routine', 'ultrasound', 'lab', 'consultation', 'other'],
    default: 'routine'
  },
  provider: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  questions: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Reminder Schema
const reminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true
  },
  enabled: {
    type: Boolean,
    default: true
  },
  times: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Baby Prep Checklist Schema
const checklistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['hospitalBag', 'nursery'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  items: [{
    id: Number,
    text: String,
    checked: {
      type: Boolean,
      default: false
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for better query performance
moodEntrySchema.index({ userId: 1, date: -1 });
kickEntrySchema.index({ userId: 1, time: -1 });
contractionSchema.index({ userId: 1, startTime: -1 });
appointmentSchema.index({ userId: 1, date: 1 });

export const MoodEntry = mongoose.model('MoodEntry', moodEntrySchema);
export const KickEntry = mongoose.model('KickEntry', kickEntrySchema);
export const Contraction = mongoose.model('Contraction', contractionSchema);
export const Appointment = mongoose.model('Appointment', appointmentSchema);
export const Reminder = mongoose.model('Reminder', reminderSchema);
export const Checklist = mongoose.model('Checklist', checklistSchema);

