import { validationResult } from 'express-validator';

// Added: Middleware to handle express-validator validation errors
// This ensures validation errors from express-validator are properly caught and passed to error handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next({ message: errors.array().map(e => e.msg).join(', '), statusCode: 400 });
  }
  next();
};

