const User = require('../models/userModel');
const argon2 = require('argon2');

exports.registerController = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists',
            });
        }

        const hashedPassword = await argon2.hash(password);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();


        return res.status(201).json({
            success: true,
            message: 'User registered successfully.'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error creating new User',
            error
        });
    }
};