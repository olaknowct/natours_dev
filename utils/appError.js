class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode || 500;
    // 400 - fail, 500 - error
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    // operational error - dev can predit, programming error - dev cant predit
    this.isOperational = true;

    // capturing where the error originated
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
