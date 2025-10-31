import mongoose from 'mongoose';

const issuedCertificateSchema = new mongoose.Schema({
  recipientName: {
    type: String,
    required: [true, 'Recipient name is required'],
    trim: true,
    maxlength: [100, 'Recipient name cannot exceed 100 characters']
  },
  recipientEmail: {
    type: String,
    required: [true, 'Recipient email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CertificateTemplate',
    required: [true, 'Template ID is required']
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  downloadURL: {
    type: String,
    required: [true, 'Download URL is required']
  },
  fileName: {
    type: String,
    required: [true, 'File name is required']
  },
  serialNumber: {
    type: String,
    unique: true,
    required: [true, 'Serial number is required']
  },
  customData: {
    type: Map,
    of: String,
    default: new Map()
  },
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['issued', 'downloaded', 'expired'],
    default: 'issued'
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  lastDownloaded: {
    type: Date
  },
  expiryDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for better query performance
issuedCertificateSchema.index({ serialNumber: 1 });
issuedCertificateSchema.index({ recipientEmail: 1 });
issuedCertificateSchema.index({ templateId: 1 });
issuedCertificateSchema.index({ issuedBy: 1 });
issuedCertificateSchema.index({ issueDate: -1 });
issuedCertificateSchema.index({ status: 1 });

// Generate serial number before saving
issuedCertificateSchema.pre('save', async function(next) {
  if (!this.serialNumber) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.serialNumber = `CERT-${timestamp}-${random}`.toUpperCase();
  }
  next();
});

export default mongoose.model('IssuedCertificate', issuedCertificateSchema);
