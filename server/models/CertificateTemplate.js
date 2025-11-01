import mongoose from 'mongoose';

const fieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Field name is required'],
    trim: true
  },
  x: {
    type: Number,
    required: [true, 'X coordinate is required'],
    min: [0, 'X coordinate must be positive']
  },
  y: {
    type: Number,
    required: [true, 'Y coordinate is required'],
    min: [0, 'Y coordinate must be positive']
  },
  fontSize: {
    type: Number,
    default: 12,
    min: [8, 'Font size must be at least 8'],
    max: [72, 'Font size cannot exceed 72']
  },
  color: {
    type: String,
    default: '#000000',
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Color must be a valid hex color']
  },
  fontFamily: {
    type: String,
    default: 'Helvetica'
  },
  fontWeight: {
    type: String,
    enum: ['normal', 'bold'],
    default: 'normal'
  },
  textAlign: {
    type: String,
    enum: ['left', 'center', 'right'],
    default: 'left'
  }
});

const certificateTemplateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Template title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  fields: [fieldSchema],
  backgroundImageURL: {
    type: String,
    required: [true, 'Background image is required']
  },
  backgroundImageName: {
    type: String,
    required: [true, 'Background image name is required']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usageCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
certificateTemplateSchema.index({ createdBy: 1, isActive: 1 });
certificateTemplateSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('CertificateTemplate', certificateTemplateSchema);
