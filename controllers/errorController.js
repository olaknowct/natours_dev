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
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Since dev cant predit the error we send them a generic one.
    // log the error so dev can work it out
    // 1.Log error
    console.erro(`ERROR :`, err);

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
      sendErrorProd(err, res);
      break;

    default:
      break;
  }
};
