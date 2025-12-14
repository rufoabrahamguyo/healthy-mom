import express from 'express';
import jwt from 'jsonwebtoken';
import ForumQuestion from '../models/ForumQuestion.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify token (optional for viewing, required for posting)
const authenticateOptional = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.userId = decoded.userId;
    }
    next();
  } catch (error) {
    next(); // Continue without user if token invalid
  }
};

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

// Get all questions
router.get('/', authenticateOptional, async (req, res) => {
  try {
    const questions = await ForumQuestion.find()
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({
      success: true,
      count: questions.length,
      questions
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching questions',
      error: error.message
    });
  }
});

// Get single question
router.get('/:id', async (req, res) => {
  try {
    const question = await ForumQuestion.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.json({
      success: true,
      question
    });
  } catch (error) {
    console.error('Get question error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching question',
      error: error.message
    });
  }
});

// Create new question
router.post('/', authenticate, async (req, res) => {
  try {
    const { question, questionSwahili, anonymous } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: 'Question is required'
      });
    }

    const newQuestion = new ForumQuestion({
      question,
      questionSwahili: questionSwahili || '',
      userId: req.userId,
      anonymous: anonymous !== undefined ? anonymous : true
    });

    await newQuestion.save();

    res.status(201).json({
      success: true,
      message: 'Question posted successfully',
      question: newQuestion
    });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating question',
      error: error.message
    });
  }
});

// Add answer to question
router.post('/:id/answers', authenticateOptional, async (req, res) => {
  try {
    const { text, textSwahili, answeredBy, answeredBySwahili, verified } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Answer text is required'
      });
    }

    const question = await ForumQuestion.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    question.answers.push({
      text,
      textSwahili: textSwahili || '',
      answeredBy: answeredBy || 'Anonymous',
      answeredBySwahili: answeredBySwahili || '',
      verified: verified || false,
      userId: req.userId || null
    });

    await question.save();

    res.json({
      success: true,
      message: 'Answer added successfully',
      question
    });
  } catch (error) {
    console.error('Add answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding answer',
      error: error.message
    });
  }
});

// Update question
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { question, questionSwahili } = req.body;
    const forumQuestion = await ForumQuestion.findById(req.params.id);

    if (!forumQuestion) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check if user owns this question
    if (forumQuestion.userId && forumQuestion.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own posts'
      });
    }

    forumQuestion.question = question || forumQuestion.question;
    forumQuestion.questionSwahili = questionSwahili || forumQuestion.questionSwahili;
    forumQuestion.updatedAt = Date.now();

    await forumQuestion.save();

    res.json({
      success: true,
      message: 'Question updated successfully',
      question: forumQuestion
    });
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating question',
      error: error.message
    });
  }
});

// Delete question
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const forumQuestion = await ForumQuestion.findById(req.params.id);

    if (!forumQuestion) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check if user owns this question
    if (forumQuestion.userId && forumQuestion.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own posts'
      });
    }

    await ForumQuestion.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting question',
      error: error.message
    });
  }
});

export default router;

