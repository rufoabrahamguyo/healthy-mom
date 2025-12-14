import mongoose from 'mongoose';

const clinicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  nameSwahili: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Public Hospital', 'Private Hospital', 'Maternity Hospital', 'Clinic'],
    trim: true
  },
  costRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 3
  },
  staffRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 3
  },
  phone: {
    type: String,
    trim: true
  },
  services: [{
    type: String,
    trim: true
  }],
  verified: {
    type: Boolean,
    default: false
  },
  coordinates: {
    lat: {
      type: Number
    },
    lng: {
      type: Number
    }
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

clinicSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Clinic = mongoose.model('Clinic', clinicSchema);

export default Clinic;

