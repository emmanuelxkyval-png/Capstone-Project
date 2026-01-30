const app = require('../../app');
const connectDB = require('./config/database');
require('dotenv').config();

const PORT = process.env.PORT || 5005;

// Start server function
const startServer = async () => {
  try {
    // Connect to database first
    await connectDB();
    console.log('Database connected successfully\n');

    // Start server after successful database connection
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`API: http://localhost:${PORT}/api/${process.env.API_VERSION || 'v1'}`);
      console.log(`CASHTRACK Backend is ready!\n`);
    });

    return server;
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// Initialize server
const serverPromise = startServer();

// Get server instance for graceful shutdown
let server;
serverPromise.then(s => server = s);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  if (server) {
    server.close(() => {
      console.log('Process terminated');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
