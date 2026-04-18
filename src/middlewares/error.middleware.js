/**
 * TODO: Handle errors
 *
 * Required error format: { error: { message: "..." } }
 *
 * Handle these cases:
 * 1. Mongoose ValidationError → 400 with combined error messages
 * 2. Mongoose CastError → 400 with "Invalid id format"
 * 3. Other errors → Use err.status (or 500) and err.message
 */
export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err.name === "ValidationError") {
    const message =
      err.errors && Object.keys(err.errors).length > 0
        ? Object.values(err.errors)
            .map((e) => e.message)
            .join(" ")
        : err.message;
    return res.status(400).json({ error: { message } });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ error: { message: "Invalid id format" } });
  }

  const status = err.status ?? err.statusCode ?? 500;
  const message = err.message || "Internal Server Error";
  return res.status(status).json({ error: { message } });
}
