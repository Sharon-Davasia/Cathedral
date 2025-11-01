import express from 'express';
import { body } from 'express-validator';
import {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  generateCertificate,
  getIssuedCertificates,
  downloadCertificate
} from '../controllers/certificateController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';
import { handleValidationErrors } from '../middleware/validationHandler.js'; // Added: Validation error handler

const router = express.Router();

// Validation rules
const templateValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().trim(),
  body('fields').isArray().withMessage('Fields must be an array'),
  body('fields.*.name').notEmpty().withMessage('Field name is required'),
  body('fields.*.x').isNumeric().withMessage('X coordinate must be a number'),
  body('fields.*.y').isNumeric().withMessage('Y coordinate must be a number')
];

const generateCertificateValidation = [
  body('templateId').isMongoId().withMessage('Valid template ID is required'),
  body('recipientName').trim().notEmpty().withMessage('Recipient name is required'),
  body('recipientEmail').isEmail().normalizeEmail().withMessage('Valid recipient email is required'),
  body('customData').optional().isObject().withMessage('Custom data must be an object')
];

// @route   GET /api/certificates/templates
// @desc    Get all certificate templates
// @access  Private
router.get('/templates', authenticate, getTemplates);

// @route   GET /api/certificates/templates/:id
// @desc    Get single certificate template
// @access  Private
router.get('/templates/:id', authenticate, getTemplate);

// @route   POST /api/certificates/templates
// @desc    Create certificate template
// @access  Private
// Added: handleValidationErrors to catch express-validator errors
router.post('/templates', authenticate, templateValidation, handleValidationErrors, createTemplate);

// @route   PUT /api/certificates/templates/:id
// @desc    Update certificate template
// @access  Private
router.put('/templates/:id', authenticate, templateValidation, handleValidationErrors, updateTemplate);

// @route   DELETE /api/certificates/templates/:id
// @desc    Delete certificate template
// @access  Private
router.delete('/templates/:id', authenticate, deleteTemplate);

// @route   POST /api/certificates/upload
// @desc    Upload template background image
// @access  Private
router.post('/upload', authenticate, uploadSingle, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        url: `/uploads/${req.file.filename}`,
        size: req.file.size
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading file' });
  }
});

// @route   POST /api/certificates/generate
// @desc    Generate certificate
// @access  Private
router.post('/generate', authenticate, generateCertificateValidation, handleValidationErrors, generateCertificate);

// @route   GET /api/certificates/issued
// @desc    Get issued certificates
// @access  Private
router.get('/issued', authenticate, getIssuedCertificates);

// @route   GET /api/certificates/download/:id
// @desc    Download certificate
// @access  Private
router.get('/download/:id', authenticate, downloadCertificate);

export default router;
