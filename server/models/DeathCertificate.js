import mongoose from 'mongoose';

const deathCertificateSchema = new mongoose.Schema({
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
  dateOfDeath: {
    type: Date,
    required: [true, 'Date of death is required']
  },
  nameOfDeceased: {
    type: String,
    required: [true, 'Name of deceased is required'],
    trim: true
  },
  sex: {
    type: String,
    required: [true, 'Sex is required'],
    enum: ['Male', 'Female'],
    trim: true
  },
  fathersName: {
    type: String,
    required: [true, "Father's name is required"],
    trim: true
  },
  mothersName: {
    type: String,
    required: [true, "Mother's name is required"],
    trim: true
  },
  spousesName: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  causeOfDeath: {
    type: String,
    required: [true, 'Cause of death is required'],
    trim: true
  },
  ageAtDeath: {
    type: String,
    required: [true, 'Age at death is required'],
    trim: true
  },
  ministersName: {
    type: String,
    required: [true, "Minister's name is required"],
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
deathCertificateSchema.index({ serialNo: 1 });
deathCertificateSchema.index({ nameOfDeceased: 1 });
deathCertificateSchema.index({ year: 1 });
deathCertificateSchema.index({ dateOfDeath: -1 });

export default mongoose.model('DeathCertificate', deathCertificateSchema);

