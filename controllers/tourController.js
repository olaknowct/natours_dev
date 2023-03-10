// const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../utils/appError');
const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

// save it to memory and will be stored as a buffer
const multerStorage = multer.memoryStorage();

// to test if the uploaded file is an image
const multerFilter = (req, file, cb) => {
  // mime type can detect what type of file, csv,
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please Upload only images.', 400), false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

// Mixed multi/single upload
exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

// upload.array();  // multiple upload req.files
// upload.single();  //single upload req.file

// process images
exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  // Cover Image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`); // 90 perecent

  // Images
  req.body.images = [];
  // we need to wait the asyn function inside before going into next other wise req.body images will be empty and file name will not be saved
  // promise all will wait for all promises from the map method
  await Promise.all(
    // we use map so that we can await all the promises of the function inside
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${++i}.jpeg`;
      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`); // 90 perecent
      req.body.images.push(filename);
    })
  );

  next();
});

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
exports.getAllTours = factory.getAll(Tour);
// exports.getAllTours = catchAsync(async (req, res, next) => {
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
//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   const tours = await features.query; // query.sort().skip().limit()

//   res.status(200).json({
//     status: 'success',
//     results: tours.length,
//     data: {
//       tours,
//     },
//   });
// });

// --- catching  errorrs in asynch function----
// --- in order to get rid of try catch ---
// The function should not be called right away
// create tour should be a function not a result of calling function
// the function should sit inside and wait until express calls it
// express will call it as soon as the route hits the route
// sol : return an anynomous function not call a function
exports.createTour = factory.createOne(Tour);
// exports.createTour = catchAsync(async (req, res, next) => {
// const newTour = new Tour({});
// newTour.save()

// const newTour = await Tour.create(req.body);

// res.status(201).json({
// status: 'Success',
// data: {
// tour: newTour,
// },
// });
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
// });

exports.getTour = factory.getOne(Tour, { path: 'reviews' });
// exports.getTour = catchAsync(async (req, res, next) => {
// Populate is used usually of schema has relations
// Populate behind the scene use another queery and might affect your performance
// const tour = await Tour.findById(req.params.id).populate('reviews');
// .populate({
//   path: 'guides',
//   select: '-__v -passwordChangedAt',
// });
// if (!tour) {
// return next(new AppError('No Tour Found with That ID', 404));
// }
// Tour.findOne({_id: req.params.id})
// res.status(200).json({
// status: 'Success',
// data: {
// tour,
// },
// });

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
// });

exports.updateTour = factory.updateOne(Tour);
// this function will wait until it gets called, factory delete one will return a function
exports.deleteTour = factory.deleteOne(Tour);

// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);
//   if (!tour) {
//     return next(new AppError('No Tour Found with That ID', 404));
//   }
//   res.status(204).json({ status: 'succes', data: null });
// });

exports.getTourStats = catchAsync(async (req, res, next) => {
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
});

// calculate the busiest month of a given year: how many tours start in each of the month of the given year
// Count how many tours on each month
exports.getMontlyPlan = catchAsync(async (req, res, next) => {
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
});

// /tours-within?distance=223&center=-40,45&unit=mi - another options
// /tours-within/233/center/14.474934, 121.014917/unit/mi - lot cleaner
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  // radius of the earth 3963.2
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat, lang'
      ),
      400
    );
  }
  // console.log(distance, lat, lng, unit);

  // center sphere is the coordinates of your location
  // radius - distance between your location and the nearest tour
  // GeoWithin - selects geometries within a bounding geojson geomery
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  // 1 meter to mi = 0.000621371
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat, lang'
      ),
      400
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Points',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    // display a certain field
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  });
});
