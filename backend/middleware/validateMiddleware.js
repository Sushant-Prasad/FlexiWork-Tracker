import { validationResult } from "express-validator";

/*
Validate Middleware
Purpose
- Validate request input using express-validator.

How it works
- Reads validation errors collected by express-validator.
- If errors exist, returns 400 with details.
- Otherwise, moves to the next handler.
*/

const validateMiddleware = (req, res, next) => {
  const errors = validationResult(req); // Gather validation errors from express-validator
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed", // Brief error summary
      errors: errors.array(), // Detailed array of validation error objects
    });
  }

  return next(); // No validation errors; proceed to the next middleware/handler
};

export default validateMiddleware;
export { validateMiddleware };
