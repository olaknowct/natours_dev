const mongoose = require('mongoose');
const slugify = require('slugify');

// specifying + validation + describing the Schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A Tour must have a name'],
      unique: true,
      trim: true,
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A Tour must have a difficulty'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// virtaul properties - a property that dont persist in the database but it is always available when we get it
// this virtual will be created each time we get some data out of the database
// get - getter function
// regular function not an arrow function since arrow function does'nt get this keyword
// Since its not part of the database we cant use mongoose/mongo query
// best practice since MVC logic
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Docs middleware - mongoose middleware -
// This middleware will be called before an actual docs is saved on the database
// Docs Middleware - Runs before .save() and .create(). not triggered on insert many method
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('will save comment  ');

//   next();
// });

tourSchema.post('save', function (doc, next) {
  console.log(doc);
  next();
});

// query middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

// tourSchema.pre('findOne', function (next) {
//   this.find({ secretTour: { $ne: false } });
//   next();
// });

tourSchema.pre('aggregate', function (next) {
  // add another stage so we can exclude ne = true
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});
// Creating the model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

// const testTour = new Tour({
//   name: 'The Forest Hiker',
//   rating: 4.7,
//   price: 497,
// });

// testTour
//   .save()
//   .then((doc) => console.log(doc))
//   .catch((err) => console.log(err));
