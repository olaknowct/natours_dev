const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

// Template Engine, express supports pugs, we dont need to install pug,
// defining our view template engine as pug
app.set('view engine', 'pug');

// behind the scenes will create a path joining the directory name /views
// path.join prevents bugs like below
// we dont always know whether a path that we received from somewhere already has a slash or not
//  we dont need to think about any slashes or not
app.set('views', path.join(__dirname, 'views'));

// Serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

// Global Middlewares
// Helmet - Security HTTP headers
app.use(helmet());

// Middlewares
// Middleware - a function that can modify the incoming request data
// - it stands between request and response
// Morgan - Dev Logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Express-rate-limit - Limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // time window, 100 request from the sampe IP in one hour
  message: 'Too many request from this IP, please try again in an hour!',
});

// apply the limitter only on specified routes (starts with)
app.use('/api', limiter);

// - the data from the body is added to to request object
// - midle ware express injected the data body from the req.body object
// Body Parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// after reading, then clean
// data sanitization againts nosql query injection
app.use(mongoSanitize());

// data sanitization againts XSS, injection httml
app.use(xss());

// prevent paramter pollution
// duplicate fields are prevented
app.use(
  hpp({
    // allow to be duplicate since some of the case has 2 same fields
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Creating our own middleware, without calling next then the req/res cycle will be stock at this point
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
// use for rendering pages
app.get('/', (req, res) => {
  res.status(200).render('base', {
    tour: 'The forest hiker',
    user: 'Christopher',
  });
});

app.get('/overview', (req, res) => {
  res.status(200).render('overview', {
    title: 'All Tours',
  });
});

app.get('/tour', (req, res) => {
  res.status(200).render('tour', {
    title: 'The Fores Hiker',
  });
});
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);

// API ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

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
  const statusCode = 404;

  // const err = new Error(message);
  // err.status = 'fail';
  // err.code = 404;
  // next(err);

  // pass the error into next
  // express will assume that anything will passed into next will be an error
  next(new AppError(message, statusCode));
});

// Error handling
// 4 arguments - Express knows already that this is a error handling
app.use(globalErrorHandler);

module.exports = app;

// all releated to express is here
