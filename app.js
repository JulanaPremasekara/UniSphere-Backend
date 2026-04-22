const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();



const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const lostRouter = require('./routes/lost');
const eventsRouter = require('./routes/events');
const marketplaceRoutes = require('./routes/marketplace');
const connectDB = require('./middleware/db');
const app = express();
connectDB();

// 1. CORS Configuration (Allows port 8081 to communicate with this server)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add this right after app.use(cors(...))
app.use((req, res, next) => {
  console.log(`>>> Incoming Request: ${req.method} ${req.url}`);
  next();
});

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, status: 'Server is running' });
});


// 2. Standard Middleware
app.use(logger('dev'));
app.use(express.json({ limit: '50mb' })); // Increased limit for image uploads
app.use(express.urlencoded({ limit: '50mb', extended: false }));
app.use(cookieParser());

// 3. Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/events', eventsRouter);
app.use('/lost', lostRouter);
app.use('/api/marketplace', marketplaceRoutes);

// 4. API-Friendly Error Handling
// Catch 404
app.use(function(req, res, next) {
  next(createError(404));
});

// Error Handler
app.use(function(err, req, res, next) {
  // Set error details for development
  const errorDetails = req.app.get('env') === 'development' ? err : {};
  
  res.status(err.status || 500);
  res.json({
    success: false,
    message: err.message,
    error: errorDetails
  });
});

module.exports = app;