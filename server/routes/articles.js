import express from 'express';
import HealthArticle from '../models/HealthArticle.js';

const router = express.Router();

// Get all articles
router.get('/', async (req, res) => {
  try {
    const { category, verified } = req.query;
    
    let query = {};
    if (category) {
      query.category = category;
    }
    if (verified !== undefined) {
      query.verified = verified === 'true';
    }

    const articles = await HealthArticle.find(query).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: articles.length,
      articles
    });
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching articles',
      error: error.message
    });
  }
});

// Get single article
router.get('/:id', async (req, res) => {
  try {
    const article = await HealthArticle.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    res.json({
      success: true,
      article
    });
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching article',
      error: error.message
    });
  }
});

export default router;

