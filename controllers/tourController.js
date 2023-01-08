const fs = require('fs');

// Top level code = only executed once
// what if the data gets updated does the server restarts?
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, val) => {
  const id = req.params.id * 1;
  if (id > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }

  next();
};

// Route Handlers
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.createTour = (req, res) => {
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

exports.getTour = (req, res) => {
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

exports.updateTour = (req, res) => {
  res
    .status(200)
    .json({ status: 'succes', data: { tour: '<Updated Tour Here...>' } });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({ status: 'succes', data: null });
};
