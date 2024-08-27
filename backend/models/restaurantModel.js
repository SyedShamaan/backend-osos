const mongoose = require('mongoose');

// Define the schema for a restaurant
const RestaurantSchema = new mongoose.Schema({
  restaurant_id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  address: {
    building: {
      type: String
    },
    street: {
      type: String
    },
    zipcode: {
      type: String
    },
    coord: {
      type: [Number],
      index: '2dsphere', // Geospatial index for coordinates
      required: true
    }
  },
  borough: {
    type: String
  },
  cuisine: {
    type: String
  },
  grades: [{
    date: {
      type: Date
    },
    grade: {
      type: String
    },
    score: {
      type: Number
    }
  }]
});

// Create the model from the schema
const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

module.exports = Restaurant;
