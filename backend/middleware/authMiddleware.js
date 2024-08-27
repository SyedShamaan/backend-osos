const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET

const auth = (req, res, next) => {
    const token = req.header('osos-auth-token');
    if(!token) {
        return res.status(401).json({
            message: 'No token, authorization denied'
        });
    }

    try {
        const decoded = jwt.verify(token, jwt_secret);
        req.user = decoded.id;
        next();
    }
    catch(error) {
        res.status(401).json({
            message: 'Token is invalid', error
        })
    }
}

module.exports = auth;