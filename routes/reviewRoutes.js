const express = require('express');
const {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  setTourUserIds,
  getReview,
} = require('./../controllers/reviewController');
const { protect, restrictTo } = require('./../controllers/authController');
const { checkIfBooked } = require('./../controllers/bookingController');

const router = express.Router({ mergeParams: true });

// Nested Routes
// POST /tour/12321412/reviews
// GET /tour/12321412/reviews

router.use(protect);
router
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user'), setTourUserIds, checkIfBooked, createReview);

router
  .route('/:id')
  .get(getReview)
  .patch(restrictTo('user', 'admin'), updateReview)
  .delete(restrictTo('user', 'admin'), deleteReview);

module.exports = router;
