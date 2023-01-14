const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Middlewares
// Middleware - a function that can modify the incoming request data
// - it stands between request and response
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
// - the data from the body is added to to request object
// - midle ware express injected the data body from the req.body object
app.use(express.json());
// Serving static files
app.use(express.static(`${__dirname}/public`));
// Creating our own middleware, without calling next then the req/res cycle will be stock at this point
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// a middlewware for invalid route
// handling unhandle routes
// all - all verbs, all the http method
// operational error
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });

  const message = `Can't find ${req.originalUrl} on this server!`;

  const err = new Error(message);
  err.status = 'fail';
  err.code = 404;

  // pass the error into next
  // express will assume that anything will passed into next will be an error
  next(err);
});

// Error handling
// 4 arguments - Express knows already that this is a error handling
app.user((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.stats(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;

// all releated to express is here
