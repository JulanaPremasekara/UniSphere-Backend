const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // This looks for the MONGO_URI variable inside your .env file
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected Successfully");
    } catch (err) {
        console.error("❌ Database connection failed:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;