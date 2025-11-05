import DeathCertificate from '../models/DeathCertificate.js';
import { logger } from '../utils/logger.js';

// @desc    Get all death certificates
// @route   GET /api/death
// @access  Private
export const getDeathCertificates = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, year } = req.query;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { nameOfDeceased: { $regex: search, $options: 'i' } },
        { serialNo: { $regex: search, $options: 'i' } }
      ];
    }

    if (year) {
      query.year = year;
    }

    const certificates = await DeathCertificate.find(query)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await DeathCertificate.countDocuments(query);

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
    logger.error('Get death certificates error:', error);
    res.status(500).json({ message: 'Server error getting death certificates' });
  }
};

// @desc    Get single death certificate
// @route   GET /api/death/:id
// @access  Private
export const getDeathCertificate = async (req, res) => {
  try {
    const certificate = await DeathCertificate.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!certificate) {
      return res.status(404).json({ message: 'Death certificate not found' });
    }

    res.json({
      success: true,
      data: certificate
    });
  } catch (error) {
    logger.error('Get death certificate error:', error);
    res.status(500).json({ message: 'Server error getting death certificate' });
  }
};

// @desc    Create death certificate
// @route   POST /api/death
// @access  Private
export const createDeathCertificate = async (req, res) => {
  try {
    const certificateData = {
      ...req.body,
      createdBy: req.user._id
    };

    const certificate = await DeathCertificate.create(certificateData);

    const populatedCertificate = await DeathCertificate.findById(certificate._id)
      .populate('createdBy', 'name email');

    logger.info(`Death certificate created: ${certificate.serialNo} by ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Death certificate created successfully',
      data: populatedCertificate
    });
  } catch (error) {
    logger.error('Create death certificate error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Serial number already exists' });
    }
    res.status(500).json({ message: 'Server error creating death certificate' });
  }
};

// @desc    Update death certificate
// @route   PUT /api/death/:id
// @access  Private
export const updateDeathCertificate = async (req, res) => {
  try {
    const certificate = await DeathCertificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: 'Death certificate not found' });
    }

    const updatedData = {
      ...req.body,
      updatedBy: req.user._id
    };

    const updatedCertificate = await DeathCertificate.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email')
     .populate('updatedBy', 'name email');

    logger.info(`Death certificate updated: ${updatedCertificate.serialNo} by ${req.user.email}`);

    res.json({
      success: true,
      message: 'Death certificate updated successfully',
      data: updatedCertificate
    });
  } catch (error) {
    logger.error('Update death certificate error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Serial number already exists' });
    }
    res.status(500).json({ message: 'Server error updating death certificate' });
  }
};

// @desc    Delete death certificate
// @route   DELETE /api/death/:id
// @access  Private
export const deleteDeathCertificate = async (req, res) => {
  try {
    const certificate = await DeathCertificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: 'Death certificate not found' });
    }

    await DeathCertificate.findByIdAndDelete(req.params.id);

    logger.info(`Death certificate deleted: ${certificate.serialNo} by ${req.user.email}`);

    res.json({
      success: true,
      message: 'Death certificate deleted successfully'
    });
  } catch (error) {
    logger.error('Delete death certificate error:', error);
    res.status(500).json({ message: 'Server error deleting death certificate' });
  }
};

