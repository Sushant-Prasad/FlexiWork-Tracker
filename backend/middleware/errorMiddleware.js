/*
Error Middleware
Purpose
- Centralized error handling for the API.

How it works
- Receives thrown or forwarded errors.
- Sends a clean JSON response with status code and message.
*/

const errorMiddleware = (err, req, res, next) => {
  const status = err.statusCode || err.status || 500; // Prefer explicit status codes
  const message = err.message || "Server error"; // Fallback message

  res.status(status).json({ message }); // Standard JSON error response
};

export default errorMiddleware;
export { errorMiddleware };
