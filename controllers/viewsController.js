const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  // Get tour data from collection
  const tours = await Tour.find();

  // Build Tempalte
  // Render that tempalte using tour data from 1
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res) => {
  // Get the data for the requested tour including reviews and guide
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review ratings user',
  });

  console.log(tour);
  // Build Template
  // Render Template using data from 1
  res.status(200).render('tour', {
    title: 'The Fores Hiker',
    tour,
  });
});
