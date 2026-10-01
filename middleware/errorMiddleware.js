const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
};

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyPattern || {})[0] || "field";

    return res.status(409).json({
      success: false,
      message: `${duplicateField} already exists.`
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: Object.values(err.errors)
        .map((item) => item.message)
        .join(", ")
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error."
  });
};

module.exports = { notFound, errorHandler };
