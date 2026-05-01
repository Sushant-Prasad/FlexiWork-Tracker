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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  return next();
};

export default validateMiddleware;
export { validateMiddleware };
