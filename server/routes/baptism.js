import express from 'express';
import { body } from 'express-validator';
import {
  getBaptismCertificates,
  getBaptismCertificate,
  createBaptismCertificate,
  updateBaptismCertificate,
  deleteBaptismCertificate
} from '../controllers/baptismController.js';
import { authenticate } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validationHandler.js';

const router = express.Router();

// Validation rules
const baptismValidation = [
  body('serialNo').trim().notEmpty().withMessage('Serial number is required'),
  body('year').trim().notEmpty().withMessage('Year is required'),
  body('dateOfBaptism').isISO8601().withMessage('Valid date of baptism is required'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('placeOfBirth').trim().notEmpty().withMessage('Place of birth is required'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('sex').isIn(['Male', 'Female']).withMessage('Sex must be Male or Female'),
  body('fathersName').trim().notEmpty().withMessage("Father's name is required"),
  body('mothersName').trim().notEmpty().withMessage("Mother's name is required"),
  body('fathersDomicile').trim().notEmpty().withMessage("Father's domicile is required"),
  body('fathersProfession').trim().notEmpty().withMessage("Father's profession is required"),
  body('godfathersName').trim().notEmpty().withMessage("Godfather's name is required"),
  body('godmothersName').trim().notEmpty().withMessage("Godmother's name is required"),
  body('ministersName').trim().notEmpty().withMessage("Minister's name is required")
];

// @route   GET /api/baptism
// @desc    Get all baptism certificates
// @access  Private
router.get('/', authenticate, getBaptismCertificates);

// @route   GET /api/baptism/:id
// @desc    Get single baptism certificate
// @access  Private
router.get('/:id', authenticate, getBaptismCertificate);

// @route   POST /api/baptism
// @desc    Create baptism certificate
// @access  Private
router.post('/', authenticate, baptismValidation, handleValidationErrors, createBaptismCertificate);

// @route   PUT /api/baptism/:id
// @desc    Update baptism certificate
// @access  Private
router.put('/:id', authenticate, baptismValidation, handleValidationErrors, updateBaptismCertificate);

// @route   DELETE /api/baptism/:id
// @desc    Delete baptism certificate
// @access  Private
router.delete('/:id', authenticate, deleteBaptismCertificate);

export default router;

