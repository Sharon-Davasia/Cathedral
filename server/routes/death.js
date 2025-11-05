import express from 'express';
import { body } from 'express-validator';
import {
  getDeathCertificates,
  getDeathCertificate,
  createDeathCertificate,
  updateDeathCertificate,
  deleteDeathCertificate
} from '../controllers/deathController.js';
import { authenticate } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validationHandler.js';

const router = express.Router();

// Validation rules
const deathValidation = [
  body('serialNo').trim().notEmpty().withMessage('Serial number is required'),
  body('year').trim().notEmpty().withMessage('Year is required'),
  body('dateOfDeath').isISO8601().withMessage('Valid date of death is required'),
  body('nameOfDeceased').trim().notEmpty().withMessage('Name of deceased is required'),
  body('sex').isIn(['Male', 'Female']).withMessage('Sex must be Male or Female'),
  body('fathersName').trim().notEmpty().withMessage("Father's name is required"),
  body('mothersName').trim().notEmpty().withMessage("Mother's name is required"),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('causeOfDeath').trim().notEmpty().withMessage('Cause of death is required'),
  body('ageAtDeath').trim().notEmpty().withMessage('Age at death is required'),
  body('ministersName').trim().notEmpty().withMessage("Minister's name is required")
];

// @route   GET /api/death
// @desc    Get all death certificates
// @access  Private
router.get('/', authenticate, getDeathCertificates);

// @route   GET /api/death/:id
// @desc    Get single death certificate
// @access  Private
router.get('/:id', authenticate, getDeathCertificate);

// @route   POST /api/death
// @desc    Create death certificate
// @access  Private
router.post('/', authenticate, deathValidation, handleValidationErrors, createDeathCertificate);

// @route   PUT /api/death/:id
// @desc    Update death certificate
// @access  Private
router.put('/:id', authenticate, deathValidation, handleValidationErrors, updateDeathCertificate);

// @route   DELETE /api/death/:id
// @desc    Delete death certificate
// @access  Private
router.delete('/:id', authenticate, deleteDeathCertificate);

export default router;

