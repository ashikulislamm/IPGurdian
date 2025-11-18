import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Set mongoose options globally to prevent buffering timeout
mongoose.set('bufferCommands', false);
mongoose.set('bufferTimeoutMS', 30000);

const connectDB = async () => {
  try {
    // Remove deprecated options
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
      socketTimeoutMS: 45000,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Set up error handlers
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });
    
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.error('💡 Please check:');
    console.error('   1. MongoDB URI in .env file');
    console.error('   2. Network connection');
    console.error('   3. MongoDB Atlas whitelist settings');
    process.exit(1); // Stop the server if DB connection fails
  }
};

export default connectDB;
