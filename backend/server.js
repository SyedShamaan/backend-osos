const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoute = require('./routes/authRoutes');
const restaurantRoute = require('./routes/restaurantRoutes');


const mongo_url = process.env.MONGO_URL;
// console.log(mongo_url);
// const port = process.env.PORT;
const port = 5005;
const allowed_origin = process.env.ALLOWED_ORIGIN; // According to frontend
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors({
    origin: allowed_origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

mongoose.connect(mongo_url);
const connection = mongoose.connection;
connection.once('open', () => {
    app.listen(port, () => {
        console.log(`Server is listening at port ${port}`);
        })
    console.log(`MONGO DB Connected`);
});

app.get('/', (req, res) => {
    res.send(`Welcome to OSOS-backend`);
})

//routes
app.use('/auth', authRoute);
app.use('/restaurants', restaurantRoute);