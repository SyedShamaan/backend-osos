const Restaurant = require('../models/restaurantModel');

exports.nearbyRestaurants = async (req, res) => {
    const { latitude, longitude, radius } = req.body;

  try {
    const restaurants = await Restaurant.find({
      address: {
        $geoWithin: {
          $centerSphere: [
            [longitude, latitude],
            radius / 6378100, // Convert meters to radians
          ],
        },
      },
    });

    // Process the data to include average rating and number of ratings
    const processedRestaurants = restaurants.map(r => ({
      Name: r.name,
      Description: r.cuisine,
      Location: { latitude: r.address.coord[1], longitude: r.address.coord[0] },
    //   AverageRating: r.grades.length > 0 ? r.grades.reduce((sum, r) => sum + r, 0) / r.grades.length : 0,
    //   NoOfRatings: r.grades.length
    }));

    res.json(processedRestaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.distanceRestaurants = async (req, res) => {
    const { latitude, longitude, minimumDistance, maximumDistance } = req.body;

    // Convert distances to positive integers and ensure they are valid numbers
    const minDistance = Math.abs(parseInt(minimumDistance, 10)) || 0;
    const maxDistance = Math.abs(parseInt(maximumDistance, 10)) || 0;

    try {
        if (!latitude || !longitude || maxDistance === 0) {
            throw new Error("Invalid input: latitude, longitude, minimumDistance, and maximumDistance are required and must be valid.");
        }

        const restaurants = await Restaurant.aggregate([
            {
                $geoNear: {
                    near: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
                    distanceField: 'distance',
                    minDistance: minDistance,
                    maxDistance: maxDistance,
                    spherical: true,
                    key: "location" // Specify the field that has the 2dsphere index
                }
            }
        ]);

        res.json(restaurants.map(r => ({
            name: r.name,
            description: r.description,
            location: { latitude: r.location.coordinates[1], longitude: r.location.coordinates[0] },
            averageRating: r.ratings.length ? (r.ratings.reduce((a, b) => a + b, 0) / r.ratings.length) : 0,
            numberOfRatings: r.ratings.length
        })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
