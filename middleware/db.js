const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Replace the connection string with your actual MongoDB URI
    // e.g., 'mongodb://localhost:27017/UniSphere'
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Successfully');
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1); // Exit process if database fails to connect
  }
};

module.exports = connectDB;