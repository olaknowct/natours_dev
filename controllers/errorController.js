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

const handleJWTError = () =>
  new AppError('Invalid Token. Please login again', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please login again', 401);

const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Render Error Page
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    // Operationl, trusted errors: send message to client
    // we can send t he right message to client since dev knows what is the error
    // dev already predit the error
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // Since dev cant predit the error we send them a generic one.
    // log the error so dev can work it out
    // 1.Log error
    console.error(`ERROR :`, err);

    // 2. Send Generic Message
    return res.status(500).json({
      status: err.status,
      message: 'Something Went very wrong',
    });
  }

  // Render Error Page
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }
  // Since dev cant predit the error we send them a generic one.
  // log the error so dev can work it out
  // 1.Log error
  console.error(`ERROR :`, err);

  // 2. Send Generic Message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: 'Please Try again',
  });
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  switch (process.env.NODE_ENV) {
    case 'development':
      sendErrorDev(err, req, res);

      break;
    case 'production':
      let error = { ...err };
      error.message = err.message;
      switch (err.name) {
        case 'TokenExpiredError':
          error = handleJWTExpiredError();
          break;
        case 'JsonWebTokenError':
          error = handleJWTError();
          break;
        case 'CastError':
          error = handleCastErrorDB(error);
          break;
        case 'ValidationError':
          error = hanldeValidationErrorDB(error);
          break;
        default:
          break;
      }

      if (err.code === 11000) error = handleDuplicateFieldsDB(error);

      sendErrorProd(error, req, res);
      break;

    default:
  }
};
