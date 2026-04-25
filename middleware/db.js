const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Adding { family: 4 } fixes the Node 22 "ENOTFOUND" error
    await mongoose.connect(process.env.MONGO_URI, { family: 4 });
    console.log('✅ MongoDB Connected Successfully');
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;