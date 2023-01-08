const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

// Middlewares
// Middleware - a function that can modify the incoming request data
// - it stands between request and response
app.use(morgan('dev'));
// - the data from the body is added to to request object
// - midle ware express injected the data body from the req.body object
app.use(express.json());

// Creating our own middleware, without calling next then the req/res cycle will be stock at this point
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const port = 3000;

// Top level code = only executed once
// what if the data gets updated does the server restarts?
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Route Handlers
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

const createTour = (req, res) => {
  // const newTour = { id: newId, ...req.body };
  // tours = [...tours, newTour];

  // Set new id
  const newId = tours[tours.length - 1].id + 1;

  // Create new tour
  const newTour = Object.assign({ id: newId }, req.body);

  // Update Tour variable
  tours.push(newTour);

  // Persist new file
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'Success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const getTour = (req, res) => {
  // All paramaters defined in the url can be retreive from req.params
  // console.log(req.params);

  //  Convert string to number
  const id = req.params.id * 1;

  // find the tour and return
  const tour = tours.find((el) => el.id === id);

  // guard close
  // if id is greater than tours length then id is not existing since by default id is incremental
  // if (id > tours.length)
  if (!tour)
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

const updateTour = (req, res) => {
  const id = req.params.id * 1;
  if (id > tours.length)
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });

  res
    .status(200)
    .json({ status: 'succes', data: { tour: '<Updated Tour Here...>' } });
};

const deleteTour = (req, res) => {
  const id = req.params.id * 1;
  if (id > tours.length)
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });

  res.status(204).json({ status: 'succes', data: null });
};

const getAllUsers = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not yet defined!' });
};

const getUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not yet defined!' });
};

const createUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not yet defined!' });
};

const updateUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not yet defined!' });
};

const deleteUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not yet defined!' });
};

// Routes
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);

// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.route('/api/v1/users').get(getAllUsers).post(createUser);

app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

app.get('/', (req, res) => {
  // res.status(200).send('Hello from the server side');
  res
    .status(200)
    .json({ message: 'Hello from the server side', app: 'Natours' });
});

// Start Server
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
