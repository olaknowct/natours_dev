// const fs = require('fs');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price, ratingsAverage';
  next();
};

// Top level code = only executed once
// what if the data gets updated does the server restarts?
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkID = (req, res, next, val) => {
//   const id = req.params.id * 1;
//   if (id > tours.length) {
//     return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
//   }

//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res
//       .status(400)
//       .json({ status: 'failed', message: 'Missing name or price' });
//   }

//   next();
// };

// Route Handlers
exports.getAllTours = async (req, res) => {
  try {
    // Build Query
    // Execute Query
    // Send Response

    // const queryObj = { ...req.query };
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach((el) => delete queryObj[el]);
    // console.log(req.query) // gets all query param. express parse it
    // console.log(req.requestTime);
    // const tours = await Tour.find({ duration: 5, difficulty: 'easy' });

    // special moongose methods - chaining
    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // advance filtering - sample : http://localhost:3000/api/v1/tours?difficulty=easy&duration[gte]=5&limit=test
    // will simply replace gte with { difficulty: 'easy', duration: { '$gte': '5' } } which is acceptable
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr));
    // end advance filtering

    // let query = Tour.find(JSON.parse(queryStr));

    // sorting - sample: http://localhost:3000/api/v1/tours?sort=price,ratingsAverage
    // if (req.query.sort) {
    // const sortBy = req.query.sort.split(', ').join('');
    // query = query.sort(sortBy);
    // } else {
    // query = query.sort('-createdAt');
    // }
    // end sorting

    // field limiting - sample: http://localhost:3000/api/v1/tours?fields=name,duration,difficulty,price
    // select only data we want
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }
    // end field limiting

    // pagination - sample: http://localhost:3000/api/v1/tours?page=2&limit=10
    // const page = req.query.page * 1 || 1; //convert to number, default 1
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) throw new Error('This page not exists');
    // }

    // we dont need to await since we are considering filter of data
    // by doing this, it will make us have an option to filter some neccessary data
    // const query = Tour.find(queryObj);
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query; // query.sort().skip().limit()

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// --- catching  errorrs in asynch function----
// --- in order to get rid of try catch ---
// The function should not be called right away
// create tour should be a function not a result of calling function
// the function should sit inside and wait until express calls it
// express will call it as soon as the route hits the route
// sol : return an anynomous function not call a function
exports.createTour = catchAsync(async (req, res, next) => {
  // const newTour = new Tour({});
  // newTour.save()

  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'Success',
    data: {
      tour: newTour,
    },
  });
  // catch (error) {
  //   console.log(error);
  //   res.status(400).json({
  //     status: 'failed',
  //     message: 'Invalid Data sent',
  //   });
  // }

  // const newTour = { id: newId, ...req.body };
  // tours = [...tours, newTour];
  // Set new id
  // const newId = tours[tours.length - 1].id + 1;
  // Create new tour
  // const newTour = Object.assign({ id: newId }, req.body);
  // Update Tour variable
  // tours.push(newTour);
  // Persist new file
  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   (err) => {
  //     res.status(201).json({
  //       status: 'Success',
  //       data: {
  //         tour: newTour,
  //       },
  //     });
  //   }
  // );
});

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({_id: req.params.id})
    res.status(201).json({
      status: 'Success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error.message,
    });
  }

  // All paramaters defined in the url can be retreive from req.params
  // console.log(req.params);
  //  Convert string to number
  // const id = req.params.id * 1;
  // find the tour and return
  // const tour = tours.find((el) => el.id === id);
  // guard close
  // if id is greater than tours length then id is not existing since by default id is incremental
  // if (id > tours.length)
  // if (!tour)
  // return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  // res.status(200).json({
  // status: 'success',
  // results: tours.length,
  // data: {
  //   tours,
  // },
  // });
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ status: 'succes', data: { tour } });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error.message,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'succes', data: null });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error.message,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    // aggregate pipeline (mongodb not mongoose)- we passed an array, array of stages
    // match stage - a query to filter object/certain elements in mongodb
    // Group stage - allows us to group together using accumulator(calculating average and etc)
    // Sort stage - allows to sort it by new obj name
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        // api obj name : operations : db column name data
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 }, // we add 1 to each document
          numRatings: { $avg: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      // {
      //   $match: { _id: { $ne: 'EASY'}}
      // }
    ]);

    res.status(200).json({
      status: 'success',
      results: stats.length,
      data: {
        stats,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error.message,
    });
  }
};

// calculate the busiest month of a given year: how many tours start in each of the month of the given year
// Count how many tours on each month
exports.getMontlyPlan = async (req, res) => {
  try {
    // unwind stage - deconstruct an array field from the info docs, then output one docs for each element of the array??
    // project stage - hide property
    //  add fields - add another property
    const year = req.params.year * 1; //2021
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: {
          month: '$_id',
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: {
          numTourStarts: -1,
        },
      },
      {
        $limit: 12,
      },
    ]);
    res.status(200).json({
      status: 'success',
      results: plan.length,
      data: {
        plan,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error.message,
    });
  }
};
