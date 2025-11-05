import mongoose from 'mongoose';

const marriageCertificateSchema = new mongoose.Schema({
  serialNo: {
    type: String,
    required: [true, 'Serial number is required'],
    trim: true,
    unique: true
  },
  year: {
    type: String,
    required: [true, 'Year is required'],
    trim: true
  },
  dateOfMarriage: {
    type: Date,
    required: [true, 'Date of marriage is required']
  },
  placeOfMarriage: {
    type: String,
    required: [true, 'Place of marriage is required'],
    trim: true
  },
  bridegroomsName: {
    type: String,
    required: [true, "Bridegroom's name is required"],
    trim: true
  },
  bridegroomsFathersName: {
    type: String,
    required: [true, "Bridegroom's father's name is required"],
    trim: true
  },
  bridesName: {
    type: String,
    required: [true, "Bride's name is required"],
    trim: true
  },
  bridesFathersName: {
    type: String,
    required: [true, "Bride's father's name is required"],
    trim: true
  },
  witness1: {
    type: String,
    required: [true, 'Witness 1 is required'],
    trim: true
  },
  witness2: {
    type: String,
    required: [true, 'Witness 2 is required'],
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
marriageCertificateSchema.index({ serialNo: 1 });
marriageCertificateSchema.index({ bridegroomsName: 1 });
marriageCertificateSchema.index({ bridesName: 1 });
marriageCertificateSchema.index({ year: 1 });
marriageCertificateSchema.index({ dateOfMarriage: -1 });

export default mongoose.model('MarriageCertificate', marriageCertificateSchema);

