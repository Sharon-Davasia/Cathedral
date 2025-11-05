import BaptismCertificate from '../models/BaptismCertificate.js';
import { logger } from '../utils/logger.js';

// @desc    Get all baptism certificates
// @route   GET /api/baptism
// @access  Private
export const getBaptismCertificates = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, year } = req.query;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { serialNo: { $regex: search, $options: 'i' } }
      ];
    }

    if (year) {
      query.year = year;
    }

    const certificates = await BaptismCertificate.find(query)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await BaptismCertificate.countDocuments(query);

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
    logger.error('Get baptism certificates error:', error);
    res.status(500).json({ message: 'Server error getting baptism certificates' });
  }
};

// @desc    Get single baptism certificate
// @route   GET /api/baptism/:id
// @access  Private
export const getBaptismCertificate = async (req, res) => {
  try {
    const certificate = await BaptismCertificate.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!certificate) {
      return res.status(404).json({ message: 'Baptism certificate not found' });
    }

    res.json({
      success: true,
      data: certificate
    });
  } catch (error) {
    logger.error('Get baptism certificate error:', error);
    res.status(500).json({ message: 'Server error getting baptism certificate' });
  }
};

// @desc    Create baptism certificate
// @route   POST /api/baptism
// @access  Private
export const createBaptismCertificate = async (req, res) => {
  try {
    const certificateData = {
      ...req.body,
      createdBy: req.user._id
    };

    const certificate = await BaptismCertificate.create(certificateData);

    const populatedCertificate = await BaptismCertificate.findById(certificate._id)
      .populate('createdBy', 'name email');

    logger.info(`Baptism certificate created: ${certificate.serialNo} by ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Baptism certificate created successfully',
      data: populatedCertificate
    });
  } catch (error) {
    logger.error('Create baptism certificate error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Serial number already exists' });
    }
    res.status(500).json({ message: 'Server error creating baptism certificate' });
  }
};

// @desc    Update baptism certificate
// @route   PUT /api/baptism/:id
// @access  Private
export const updateBaptismCertificate = async (req, res) => {
  try {
    const certificate = await BaptismCertificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: 'Baptism certificate not found' });
    }

    const updatedData = {
      ...req.body,
      updatedBy: req.user._id
    };

    const updatedCertificate = await BaptismCertificate.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email')
     .populate('updatedBy', 'name email');

    logger.info(`Baptism certificate updated: ${updatedCertificate.serialNo} by ${req.user.email}`);

    res.json({
      success: true,
      message: 'Baptism certificate updated successfully',
      data: updatedCertificate
    });
  } catch (error) {
    logger.error('Update baptism certificate error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Serial number already exists' });
    }
    res.status(500).json({ message: 'Server error updating baptism certificate' });
  }
};

// @desc    Delete baptism certificate
// @route   DELETE /api/baptism/:id
// @access  Private
export const deleteBaptismCertificate = async (req, res) => {
  try {
    const certificate = await BaptismCertificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: 'Baptism certificate not found' });
    }

    await BaptismCertificate.findByIdAndDelete(req.params.id);

    logger.info(`Baptism certificate deleted: ${certificate.serialNo} by ${req.user.email}`);

    res.json({
      success: true,
      message: 'Baptism certificate deleted successfully'
    });
  } catch (error) {
    logger.error('Delete baptism certificate error:', error);
    res.status(500).json({ message: 'Server error deleting baptism certificate' });
  }
};

