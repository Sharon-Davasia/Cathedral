import MarriageCertificate from '../models/MarriageCertificate.js';
import { logger } from '../utils/logger.js';

// @desc    Get all marriage certificates
// @route   GET /api/marriage
// @access  Private
export const getMarriageCertificates = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, year } = req.query;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { bridegroomsName: { $regex: search, $options: 'i' } },
        { bridesName: { $regex: search, $options: 'i' } },
        { serialNo: { $regex: search, $options: 'i' } }
      ];
    }

    if (year) {
      query.year = year;
    }

    const certificates = await MarriageCertificate.find(query)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MarriageCertificate.countDocuments(query);

    res.json({
      success: true,
      data: certificates,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    logger.error('Get marriage certificates error:', error);
    res.status(500).json({ message: 'Server error getting marriage certificates' });
  }
};

// @desc    Get single marriage certificate
// @route   GET /api/marriage/:id
// @access  Private
export const getMarriageCertificate = async (req, res) => {
  try {
    const certificate = await MarriageCertificate.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!certificate) {
      return res.status(404).json({ message: 'Marriage certificate not found' });
    }

    res.json({
      success: true,
      data: certificate
    });
  } catch (error) {
    logger.error('Get marriage certificate error:', error);
    res.status(500).json({ message: 'Server error getting marriage certificate' });
  }
};

// @desc    Create marriage certificate
// @route   POST /api/marriage
// @access  Private
export const createMarriageCertificate = async (req, res) => {
  try {
    const certificateData = {
      ...req.body,
      createdBy: req.user._id
    };

    const certificate = await MarriageCertificate.create(certificateData);

    const populatedCertificate = await MarriageCertificate.findById(certificate._id)
      .populate('createdBy', 'name email');

    logger.info(`Marriage certificate created: ${certificate.serialNo} by ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Marriage certificate created successfully',
      data: populatedCertificate
    });
  } catch (error) {
    logger.error('Create marriage certificate error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Serial number already exists' });
    }
    res.status(500).json({ message: 'Server error creating marriage certificate' });
  }
};

// @desc    Update marriage certificate
// @route   PUT /api/marriage/:id
// @access  Private
export const updateMarriageCertificate = async (req, res) => {
  try {
    const certificate = await MarriageCertificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: 'Marriage certificate not found' });
    }

    const updatedData = {
      ...req.body,
      updatedBy: req.user._id
    };

    const updatedCertificate = await MarriageCertificate.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email')
     .populate('updatedBy', 'name email');

    logger.info(`Marriage certificate updated: ${updatedCertificate.serialNo} by ${req.user.email}`);

    res.json({
      success: true,
      message: 'Marriage certificate updated successfully',
      data: updatedCertificate
    });
  } catch (error) {
    logger.error('Update marriage certificate error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Serial number already exists' });
    }
    res.status(500).json({ message: 'Server error updating marriage certificate' });
  }
};

// @desc    Delete marriage certificate
// @route   DELETE /api/marriage/:id
// @access  Private
export const deleteMarriageCertificate = async (req, res) => {
  try {
    const certificate = await MarriageCertificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: 'Marriage certificate not found' });
    }

    await MarriageCertificate.findByIdAndDelete(req.params.id);

    logger.info(`Marriage certificate deleted: ${certificate.serialNo} by ${req.user.email}`);

    res.json({
      success: true,
      message: 'Marriage certificate deleted successfully'
    });
  } catch (error) {
    logger.error('Delete marriage certificate error:', error);
    res.status(500).json({ message: 'Server error deleting marriage certificate' });
  }
};

