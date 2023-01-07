const express = require('express');

const app = express();

const port = 3000;

app.get('/', (req, res) => {
  // res.status(200).send('Hello from the server side');
  res
    .status(200)
    .json({ message: 'Hello from the server side', app: 'Natours' });
});

app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
