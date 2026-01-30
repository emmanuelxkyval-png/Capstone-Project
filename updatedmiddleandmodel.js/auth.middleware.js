const jwt = require('jsonwebtoken');
const User = require('../models/User.model');


exports.protect = async (req, res, next) => {
    try {
        let token;


        if (
            req.headers.authorization && 
            req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }


        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'Access deined. Please login to continue.'
            });
        }

        

            const decoded = jwt.verify(token, process.env.JWT_SECRET);


            const user = await User.findById(decoded.id)
            .select('-password')
            .lean();

            if (!user) {
                return res.status(401).json({
                    status: 'error',
                    message: 'User no longer exists'
                });
            }

            if (user.isActive== false) {
                return res.status(403).json({
                    status: 'error',
                    message: 'User account is inactive'
                });
            }

            req.user = user;

            next();
        } catch (error) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid or expired token'
            });
        }
    
};
