const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.message.includes('Certificate already exists')) {
    return res.status(409).json({
      success: false,
      error: 'Certificate already exists with the provided details'
    });
  }

  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
};

module.exports = errorHandler;