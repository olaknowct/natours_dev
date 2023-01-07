const fs = require('fs');
const express = require('express');

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

app.post('/api/v1/tours', (req, res) => {
  console.log(req.body);
  res.end('done');
});

app.get('/', (req, res) => {
  // res.status(200).send('Hello from the server side');
  res
    .status(200)
    .json({ message: 'Hello from the server side', app: 'Natours' });
});

app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
