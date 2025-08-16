export const errorHandler = (err, req, res, next) => {
  console.error("🔥 Error caught:", err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  switch (err.name) {
    case "ValidationError":
      // Handles mongoose validation errors
      message = Object.values(err.errors)
        .map((val) => val.message)
        .join(", ");
      statusCode = 400;
      break;

    case "CastError":
      // Invalid ObjectId or similar casting issues
      message = `Invalid value for field: ${err.path}`;
      statusCode = 400;
      break;

    case "MongoServerError":
      if (err.code === 11000) {
        // Duplicate key error
        const field = Object.keys(err.keyValue).join(", ");
        message = `Duplicate value entered for field: ${field}`;
        statusCode = 409;
      }
      break;

    case "JsonWebTokenError":
      message = "Invalid token. Please log in again.";
      statusCode = 401;
      break;

    case "TokenExpiredError":
      message = "Token expired. Please log in again.";
      statusCode = 401;
      break;

    default:
      break;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
