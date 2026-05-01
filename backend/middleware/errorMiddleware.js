/*
Error Middleware
Purpose
- Centralized error handling for the API.

How it works
- Receives thrown or forwarded errors.
- Sends a clean JSON response with status code and message.
*/

const errorMiddleware = (err, req, res, next) => {
  const status = err.statusCode || err.status || 500;
  const message = err.message || "Server error";

  res.status(status).json({ message });
};

export default errorMiddleware;
export { errorMiddleware };
