import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'uzazi-salama-secret-key-change-in-production-2024';

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'No token provided' 
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};

// Save user data (mood, kicks, contractions, appointments, etc.)
router.post('/data', verifyToken, async (req, res) => {
  try {
    const { dataType, data } = req.body;

    if (!dataType || !data) {
      return res.status(400).json({
        success: false,
        message: 'dataType and data are required'
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Store data in user's data object
    if (!user.userData) {
      user.userData = {};
    }

    user.userData[dataType] = {
      ...data,
      lastUpdated: new Date()
    };

    await user.save();

    res.json({
      success: true,
      message: 'Data saved successfully',
      data: user.userData[dataType]
    });
  } catch (error) {
    console.error('Save user data error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving data',
      error: error.message
    });
  }
});

// Get user data
router.get('/data/:dataType', verifyToken, async (req, res) => {
  try {
    const { dataType } = req.params;

    const user = await User.findById(req.userId).select('userData');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const data = user.userData?.[dataType] || null;

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Get user data error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching data',
      error: error.message
    });
  }
});

// Get all user data
router.get('/data', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('userData');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.userData || {}
    });
  } catch (error) {
    console.error('Get all user data error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching data',
      error: error.message
    });
  }
});

export default router;
