import mongoose from 'mongoose';

const healthArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  titleSwahili: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Nutrition', 'Symptoms', 'Lifestyle', 'Delivery', 'General'],
    trim: true
  },
  categorySwahili: {
    type: String,
    enum: ['Lishe', 'Dalili', 'Maisha', 'Kujifungua', 'Jumla'],
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  contentSwahili: {
    type: String
  },
  myth: {
    type: String,
    trim: true
  },
  mythSwahili: {
    type: String,
    trim: true
  },
  truth: {
    type: String,
    trim: true
  },
  truthSwahili: {
    type: String,
    trim: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

healthArticleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const HealthArticle = mongoose.model('HealthArticle', healthArticleSchema);

export default HealthArticle;

