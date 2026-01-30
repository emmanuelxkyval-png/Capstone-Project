# CASHTRACK Backend API

Professional Node.js + Express.js backend for CASHTRACK - Daily Cash Flow Management System for small businesses.

## 📁 Folder Structure

```
cashtrack-backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection configuration
│   ├── controllers/
│   │   ├── auth.controller.js   # Authentication logic
│   │   ├── user.controller.js   # User profile management
│   │   ├── inflow.controller.js # Cash inflow operations
│   │   ├── outflow.controller.js# Cash outflow operations
│   │   └── summary.controller.js# Daily summaries & reports
│   ├── middleware/
│   │   ├── auth.middleware.js   # JWT authentication
│   │   └── error.middleware.js  # Global error handling
│   ├── models/
│   │   ├── User.model.js        # User schema
│   │   ├── Inflow.model.js      # Inflow schema
│   │   └── Outflow.model.js     # Outflow schema
│   ├── routes/
│   │   ├── auth.routes.js       # Authentication routes
│   │   ├── user.routes.js       # User routes
│   │   ├── inflow.routes.js     # Inflow routes
│   │   ├── outflow.routes.js    # Outflow routes
│   │   └── summary.routes.js    # Summary routes
│   ├── utils/
│   │   ├── jwt.util.js          # JWT helpers
│   │   └── response.util.js     # Response formatting
│   ├── app.js                   # Express app configuration
│   └── server.js                # Server entry point
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- MongoDB (local or Atlas)
- npm >= 9.0.0

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd cashtrack-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   copy .env.example .env
   ```
   Then edit `.env` and configure:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A strong secret key for JWT tokens
   - Other settings as needed

4. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

5. **Run the server:**
   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

6. **Server will run on:** `http://localhost:5000`

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user (Protected)

### User Profile
- `GET /api/v1/users/profile` - Get user profile (Protected)
- `PUT /api/v1/users/profile` - Update profile (Protected)

### Cash Inflows
- `POST /api/v1/inflows` - Create inflow (Protected)
- `GET /api/v1/inflows` - Get all inflows with filters (Protected)
- `GET /api/v1/inflows/:id` - Get single inflow (Protected)
- `PUT /api/v1/inflows/:id` - Update inflow (Protected)
- `DELETE /api/v1/inflows/:id` - Delete inflow (Protected)

### Cash Outflows
- `POST /api/v1/outflows` - Create outflow (Protected)
- `GET /api/v1/outflows` - Get all outflows with filters (Protected)
- `GET /api/v1/outflows/:id` - Get single outflow (Protected)
- `PUT /api/v1/outflows/:id` - Update outflow (Protected)
- `DELETE /api/v1/outflows/:id` - Delete outflow (Protected)

### Summaries & Reports
- `GET /api/v1/summary/daily?date=YYYY-MM-DD` - Get daily summary (Protected)
- `GET /api/v1/summary/range?startDate=...&endDate=...` - Get range summary (Protected)
- `GET /api/v1/summary/history` - Get transaction history (Protected)

## 🔒 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 🛠️ Development

```bash
# Run in development mode with auto-reload
npm run dev

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## 📦 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Security:** Helmet, CORS, Rate Limiting, bcryptjs
- **Validation:** express-validator
- **Logging:** Morgan
- **Testing:** Jest, Supertest

## 🏗️ Architecture

This backend follows the **MVC pattern** with clean separation of concerns:

- **Models:** Database schemas and business logic
- **Controllers:** Request handlers and business operations
- **Routes:** API endpoint definitions
- **Middleware:** Authentication, validation, error handling
- **Utils:** Helper functions and utilities

## 🔐 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Rate limiting to prevent abuse
- Helmet for secure HTTP headers
- CORS protection
- Input validation and sanitization
- Soft delete for data retention

## 📝 License

ISC

## 👨‍💻 Author

Your Name

---

**Happy Coding! 🚀**
