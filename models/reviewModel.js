const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    // we need this fields so that it will also show up in JSON and Object outputs
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // }).populate({
  //   path: 'user',
  //   select: 'name photo',
  // });
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

// each combination of tour and user has always to be unique
// 2 reviews from same user is not allowed
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// create a statistics of avg and number of rating of a certain tour
// we create this a static method since we need to use/call aggregate function on the model
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // we create aggregate that match the current tour Id and calculated
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// call every time new review created
// post because we only calc after the database is being updated
reviewSchema.post('save', function () {
  // constructor is basically the model who created that doc
  // this.constructor points to the current model, in this case its the review.
  // we need to use this instead Review since it is not expprted yet nor created
  this.constructor.calcAverageRatings(this.tour);
});

// a review is deleted when findbyidandupdate, findbyidanddelete, which we dont have any document middleware but only query middleware
// findbyid update/delete is shorthand findoneand update/delete
// findeoneandupdate middleware hooks
// reviewSchema.pre(/^findOneAnd/, async function (next) {
// this.r = await this.findOne();
// next();
// });

reviewSchema.post(/^findOneAnd/, async function (doc) {
  await doc.constructor.calcAverageRatings(doc.tour); // other solutions
  // https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065554#questions/13474174
  // await this.r.constructor.calcAverageRating(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
