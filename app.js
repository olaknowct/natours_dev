const fs = require('fs');
const express = require('express');

const app = express();

const port = 3000;

// Top level code = only execited pmce
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
app.get('/', (req, res) => {
  // res.status(200).send('Hello from the server side');
  res
    .status(200)
    .json({ message: 'Hello from the server side', app: 'Natours' });
});

app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
