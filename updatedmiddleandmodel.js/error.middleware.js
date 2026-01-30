
const errorHandler = (err, req, res, next) => {
    let errorHandler = err.statusCode || 500;
    let message = err.message || 'Server Error';
    


    console.error('Error:', err);


    if (err.name === 'CastError') {
        statusCode = 404;
        message = 'Resource not found';
    }


    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        error.statusCode = 400;
        const message = `${field} already exists`;
    }


    if (err.name === 'ValidationError') {
        error.statusCode = 400;
        const message = Object.values(err.errors)
        .map(val => val.message)
        .join(', ');
    }


    if (err.name === 'JsonWebTokenError') {
        error.statusCode = 401;
        message = 'Invalid token';
    }

    if (err.name === 'TokenExpiredError') {
        error.statusCode = 401;
        message = 'Token expired';
    }

    res.status(error.statusCode).json({
        status: 'error',
        message,
        ...(process.env.NODE_ENV === 'development' && { 
            stack: err.stack })
    });
};

module.exports = errorHandler;
