const express = require('express');
const {
  getCheckoutSession,
  getAllBookings,
  createBooking,
  getBooking,
  updateBooking,
  deleteBooking,
} = require('./../controllers/bookingController');
const { protect, restrictTo } = require('./../controllers/authController');

const router = express.Router();

// The router here will not follow the rest princinple (GET, POST, PATCH, DELETE) since its not about it
// This route only for client to get a checkout session

router.use(protect);
router.get('/checkout-session/:tourId', getCheckoutSession);

router.use(restrictTo('admin', 'lead-guide'));

router.route('/').get(getAllBookings).post(createBooking);

router.route('/:id').get(getBooking).patch(updateBooking).delete(deleteBooking);

module.exports = router;
