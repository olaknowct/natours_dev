const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Object is to delete tours/reviews and etc. make a one function that does it
// returns a function
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No document found with That ID', 404));
    }
    res.status(204).json({ status: 'succes', data: null });
  });

// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);
//   if (!tour) {
//     return next(new AppError('No Tour Found with That ID', 404));
//   }
//   res.status(204).json({ status: 'succes', data: null });
// });
