const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

// specifying + validation + describing the Schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A Tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A Tour name must have a less or equal 40 character'],
      minlength: [10, 'A Tour name must have a less or equal 10 character'],
      // validate: [validator.isAlpha, 'Tour name must contain characters'],
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
      enum: {
        values: ['easy', 'medium', 'difficulty'],
        message: 'Diffculty is either: easy, medium, diffcult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be above 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // This only points to current doc on new doc creation
          return val < this.price; // 250 < 200
        },
        // adding message can be done either object/array, array if few char only otherwise object
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
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
    startLocation: {
      // start location is not for a schema option but rather an embededed object
      // in this object we can specify a couple of properties
      // In order this object to be identify as GeoJson we need types and coordinates
      // each of the field of types/coordinates will get a schema option
      // GeoJSON - a special data format where mongoDb uses
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },

      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          defalut: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        addres: String,
        description: String,
        day: Number,
      },
    ],
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
