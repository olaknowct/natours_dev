const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  // 400 bad request
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate field value: ${value}  Please use another value!`;
  return new AppError(message, 400);
};

const hanldeValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid Input Data ${errors.join('. ')}`;

  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operationl, trusted errors: send message to client
  // we can send t he right message to client since dev knows what is the error
  // dev already predit the error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Since dev cant predit the error we send them a generic one.
    // log the error so dev can work it out
    // 1.Log error
    console.error(`ERROR :`, err);

    // 2. Send Generic Message
    res.status(500).json({
      status: err.status,
      message: 'Something Went very wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  switch (process.env.NODE_ENV) {
    case 'development':
      sendErrorDev(err, res);

      break;
    case 'production':
      let error = { ...err };
      // console.log(error);
      if (err.name === 'CastError') error = handleCastErrorDB(error);
      if (err.code === 11000) error = handleDuplicateFieldsDB(error);
      if (err.name === 'ValidationError')
        error = hanldeValidationErrorDB(error);
      sendErrorProd(error, res);
      break;

    default:
  }
};
