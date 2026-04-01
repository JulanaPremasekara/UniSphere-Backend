const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Replace the connection string with your actual MongoDB URI
    // e.g., 'mongodb://localhost:27017/UniSphere'
    await mongoose.connect('mongodb+srv://UniSphere:Unisphere%401234@cluster0.ilf6i7h.mongodb.net/UniSphere?retryWrites=true&w=majority');
    console.log('MongoDB Connected Successfully');
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1); // Exit process if database fails to connect
  }
};

module.exports = connectDB;