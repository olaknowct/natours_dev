const express = require('express');
const {
  getAllReviews,
  createReview,
} = require('./../controllers/reviewController');
const { protect, restrictTo } = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

// Nested Routes
// POST /tour/12321412/reviews
// GET /tour/12321412/reviews

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), createReview);

module.exports = router;
