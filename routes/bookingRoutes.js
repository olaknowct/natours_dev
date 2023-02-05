const express = require('express');
const { getCheckoutSession } = require('./../controllers/bookingController');
const { protect, restrictTo } = require('./../controllers/authController');

const router = express.Router();

// The router here will not follow the rest princinple (GET, POST, PATCH, DELETE) since its not about it
// This route only for client to get a checkout session

router.get('/checkout-session/:tourId', protect, getCheckoutSession);

module.exports = router;
