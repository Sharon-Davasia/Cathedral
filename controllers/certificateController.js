import CertificateTemplate from '../models/CertificateTemplate.js';
import IssuedCertificate from '../models/IssuedCertificate.js';
import { generatePDF } from '../utils/pdfGenerator.js';
import { logger } from '../utils/logger.js';
import path from 'path';

// @desc    Get all certificate templates
// @route   GET /api/certificates/templates
// @access  Private
export const getTemplates = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const query = { isActive: true };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const templates = await CertificateTemplate.find(query)
      .populate('createdBy', 'name email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await CertificateTemplate.countDocuments(query);

    res.json({
      success: true,
      data: templates,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    logger.error('Get templates error:', error);
    res.status(500).json({ message: 'Server error getting templates' });
  }
};

// @desc    Get single certificate template
// @route   GET /api/certificates/templates/:id
// @access  Private
export const getTemplate = async (req, res) => {
  try {
    const template = await CertificateTemplate.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    logger.error('Get template error:', error);
    res.status(500).json({ message: 'Server error getting template' });
  }
};

// @desc    Create certificate template
// @route   POST /api/certificates/templates
// @access  Private
export const createTemplate = async (req, res) => {
  try {
    const { title, description, fields, backgroundImageURL, backgroundImageName } = req.body;

    const template = await CertificateTemplate.create({
      title,
      description,
      fields,
      backgroundImageURL,
      backgroundImageName,
      createdBy: req.user._id
    });

    const populatedTemplate = await CertificateTemplate.findById(template._id)
      .populate('createdBy', 'name email');

    logger.info(`Template created: ${title} by ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Template created successfully',
      data: populatedTemplate
    });
  } catch (error) {
    logger.error('Create template error:', error);
    res.status(500).json({ message: 'Server error creating template' });
  }
};

// @desc    Update certificate template
// @route   PUT /api/certificates/templates/:id
// @access  Private
export const updateTemplate = async (req, res) => {
  try {
    const { title, description, fields, isActive } = req.body;

    const template = await CertificateTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Check if user can update this template
    if (template.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this template' });
    }

    const updatedTemplate = await CertificateTemplate.findByIdAndUpdate(
      req.params.id,
      { title, description, fields, isActive },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    logger.info(`Template updated: ${title} by ${req.user.email}`);

    res.json({
      success: true,
      message: 'Template updated successfully',
      data: updatedTemplate
    });
  } catch (error) {
    logger.error('Update template error:', error);
    res.status(500).json({ message: 'Server error updating template' });
  }
};

// @desc    Delete certificate template
// @route   DELETE /api/certificates/templates/:id
// @access  Private
export const deleteTemplate = async (req, res) => {
  try {
    const template = await CertificateTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Check if user can delete this template
    if (template.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this template' });
    }

    // Soft delete
    template.isActive = false;
    await template.save();

    logger.info(`Template deleted: ${template.title} by ${req.user.email}`);

    res.json({
      success: true,
      message: 'Template deleted successfully'
    });
  } catch (error) {
    logger.error('Delete template error:', error);
    res.status(500).json({ message: 'Server error deleting template' });
  }
};

// @desc    Generate certificate
// @route   POST /api/certificates/generate
// @access  Private
export const generateCertificate = async (req, res) => {
  try {
    const { templateId, recipientName, recipientEmail, customData } = req.body;

    const template = await CertificateTemplate.findById(templateId);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Generate PDF
    const { fileName, filePath } = await generatePDF(template, {
      recipientName,
      recipientEmail,
      customData
    });

    // Create certificate record
    const certificate = await IssuedCertificate.create({
      recipientName,
      recipientEmail,
      templateId,
      downloadURL: `/certificates/${fileName}`,
      fileName,
      customData,
      issuedBy: req.user._id
    });

    // Update template usage count
    template.usageCount += 1;
    await template.save();

    logger.info(`Certificate generated: ${fileName} for ${recipientEmail}`);

    res.status(201).json({
      success: true,
      message: 'Certificate generated successfully',
      data: certificate
    });
  } catch (error) {
    logger.error('Generate certificate error:', error);
    res.status(500).json({ message: 'Server error generating certificate' });
  }
};

// @desc    Get issued certificates
// @route   GET /api/certificates/issued
// @access  Private
export const getIssuedCertificates = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, templateId, status } = req.query;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { recipientName: { $regex: search, $options: 'i' } },
        { recipientEmail: { $regex: search, $options: 'i' } },
        { serialNumber: { $regex: search, $options: 'i' } }
      ];
    }

    if (templateId) {
      query.templateId = templateId;
    }

    if (status) {
      query.status = status;
    }

    const certificates = await IssuedCertificate.find(query)
      .populate('templateId', 'title')
      .populate('issuedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await IssuedCertificate.countDocuments(query);

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
    logger.error('Get issued certificates error:', error);
    res.status(500).json({ message: 'Server error getting certificates' });
  }
};

// @desc    Download certificate
// @route   GET /api/certificates/download/:id
// @access  Private
export const downloadCertificate = async (req, res) => {
  try {
    const certificate = await IssuedCertificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Update download count and status
    certificate.downloadCount += 1;
    certificate.lastDownloaded = new Date();
    certificate.status = 'downloaded';
    await certificate.save();

    const filePath = path.join(process.cwd(), 'certificates', certificate.fileName);
    
    res.download(filePath, certificate.fileName, (err) => {
      if (err) {
        logger.error('Download error:', err);
        res.status(500).json({ message: 'Error downloading file' });
      }
    });
  } catch (error) {
    logger.error('Download certificate error:', error);
    res.status(500).json({ message: 'Server error downloading certificate' });
  }
};
