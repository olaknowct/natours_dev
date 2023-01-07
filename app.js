const fs = require('fs');
const express = require('express');
const e = require('express');

const app = express();

// Middleware - a function that can modify the incoming request data
// - it stands between request and response
// - the data from the body is added to to request object
// - midle ware express injected the data body from the req.body object
app.use(express.json());

const port = 3000;

// Top level code = only executed once
// what if the data gets updated does the server restarts?
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
  // All paramaters defined in the url can be retreive from req.params
  // console.log(req.params);

  //  Convert string to number
  const id = req.params.id * 1;

  // guard close
  // if id is greater than tours length then id is not existing since by default id is incremental
  // if (id > tours.length)
  if (!tour)
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });

  // find the tour and return
  const tour = tours.find((el) => el.id === req.params.id);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
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
});

app.get('/', (req, res) => {
  // res.status(200).send('Hello from the server side');
  res
    .status(200)
    .json({ message: 'Hello from the server side', app: 'Natours' });
});

app.patch('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;
  if (id > tours.length)
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });

  res
    .status(200)
    .json({ status: 'succes', data: { tour: '<Updated Tour Here...>' } });
});

app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
