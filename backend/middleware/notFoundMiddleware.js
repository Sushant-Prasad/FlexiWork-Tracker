/*
Not Found Middleware
Purpose
- Handle unknown routes.

How it works
- Runs after all routes.
- Returns a 404 response with the path.
*/

const notFoundMiddleware = (req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` }); // Return a standard 404 payload for unmatched routes
};

export default notFoundMiddleware;
export { notFoundMiddleware };
