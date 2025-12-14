import express from 'express';
import Clinic from '../models/Clinic.js';

const router = express.Router();

// Get all clinics
router.get('/', async (req, res) => {
  try {
    const { location, verified } = req.query;
    
    let query = {};
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (verified !== undefined) {
      query.verified = verified === 'true';
    }

    const clinics = await Clinic.find(query).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: clinics.length,
      clinics
    });
  } catch (error) {
    console.error('Get clinics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching clinics',
      error: error.message
    });
  }
});

// Get single clinic
router.get('/:id', async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id);
    
    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: 'Clinic not found'
      });
    }

    res.json({
      success: true,
      clinic
    });
  } catch (error) {
    console.error('Get clinic error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching clinic',
      error: error.message
    });
  }
});

export default router;

