import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  textSwahili: {
    type: String
  },
  answeredBy: {
    type: String,
    required: true,
    trim: true
  },
  answeredBySwahili: {
    type: String,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const forumQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  questionSwahili: {
    type: String,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  anonymous: {
    type: Boolean,
    default: true
  },
  answers: [answerSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

forumQuestionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
forumQuestionSchema.index({ createdAt: -1 });
forumQuestionSchema.index({ userId: 1 });

const ForumQuestion = mongoose.model('ForumQuestion', forumQuestionSchema);

export default ForumQuestion;

