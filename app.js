const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Middlewares
// Middleware - a function that can modify the incoming request data
// - it stands between request and response
app.use(morgan('dev'));
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

module.exports = app;

// all releated to express is here
