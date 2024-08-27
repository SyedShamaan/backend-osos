const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {nearbyRestaurants, distanceRestaurants} = require('../controllers/restaurantController');

router.post('/nearby', auth, nearbyRestaurants);
router.post('/distance-range', auth, distanceRestaurants);

module.exports = router;