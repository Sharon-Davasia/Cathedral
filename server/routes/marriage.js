import express from 'express';
import { body } from 'express-validator';
import {
  getMarriageCertificates,
  getMarriageCertificate,
  createMarriageCertificate,
  updateMarriageCertificate,
  deleteMarriageCertificate
} from '../controllers/marriageController.js';
import { authenticate } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validationHandler.js';

const router = express.Router();

// Validation rules
const marriageValidation = [
  body('serialNo').trim().notEmpty().withMessage('Serial number is required'),
  body('year').trim().notEmpty().withMessage('Year is required'),
  body('dateOfMarriage').isISO8601().withMessage('Valid date of marriage is required'),
  body('placeOfMarriage').trim().notEmpty().withMessage('Place of marriage is required'),
  body('bridegroomsName').trim().notEmpty().withMessage("Bridegroom's name is required"),
  body('bridegroomsFathersName').trim().notEmpty().withMessage("Bridegroom's father's name is required"),
  body('bridesName').trim().notEmpty().withMessage("Bride's name is required"),
  body('bridesFathersName').trim().notEmpty().withMessage("Bride's father's name is required"),
  body('witness1').trim().notEmpty().withMessage('Witness 1 is required'),
  body('witness2').trim().notEmpty().withMessage('Witness 2 is required')
];

// @route   GET /api/marriage
// @desc    Get all marriage certificates
// @access  Private
router.get('/', authenticate, getMarriageCertificates);

// @route   GET /api/marriage/:id
// @desc    Get single marriage certificate
// @access  Private
router.get('/:id', authenticate, getMarriageCertificate);

// @route   POST /api/marriage
// @desc    Create marriage certificate
// @access  Private
router.post('/', authenticate, marriageValidation, handleValidationErrors, createMarriageCertificate);

// @route   PUT /api/marriage/:id
// @desc    Update marriage certificate
// @access  Private
router.put('/:id', authenticate, marriageValidation, handleValidationErrors, updateMarriageCertificate);

// @route   DELETE /api/marriage/:id
// @desc    Delete marriage certificate
// @access  Private
router.delete('/:id', authenticate, deleteMarriageCertificate);

export default router;

