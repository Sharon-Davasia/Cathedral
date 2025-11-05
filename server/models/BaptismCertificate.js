import mongoose from 'mongoose';

const baptismCertificateSchema = new mongoose.Schema({
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
  dateOfBaptism: {
    type: Date,
    required: [true, 'Date of baptism is required']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  placeOfBirth: {
    type: String,
    required: [true, 'Place of birth is required'],
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
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
  fathersDomicile: {
    type: String,
    required: [true, "Father's domicile is required"],
    trim: true
  },
  fathersProfession: {
    type: String,
    required: [true, "Father's profession is required"],
    trim: true
  },
  godfathersName: {
    type: String,
    required: [true, "Godfather's name is required"],
    trim: true
  },
  godmothersName: {
    type: String,
    required: [true, "Godmother's name is required"],
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
baptismCertificateSchema.index({ serialNo: 1 });
baptismCertificateSchema.index({ name: 1 });
baptismCertificateSchema.index({ year: 1 });
baptismCertificateSchema.index({ dateOfBaptism: -1 });

export default mongoose.model('BaptismCertificate', baptismCertificateSchema);

