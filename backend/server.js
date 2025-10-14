import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import ipRoutes from "./routes/ipRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import ipfsService from "./services/ipfsService.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Test IPFS connection on startup
async function testIPFSConnection() {
  console.log('🔄 Testing IPFS connection...');
  const isConnected = await ipfsService.testConnection();
  if (isConnected) {
    console.log('✅ IPFS connection successful - File uploads enabled');
    console.log('🌐 IPFS Gateway: http://127.0.0.1:8080');
    console.log('🔧 IPFS API: http://127.0.0.1:5001/api/v0');
  } else {
    console.log('❌ IPFS connection failed - File uploads may not work');
    console.log('💡 To fix IPFS issues:');
    console.log('   1. Make sure IPFS Desktop is running');
    console.log('   2. Configure CORS: run node setup-ipfs.js');
    console.log('   3. Or see: IPFS_SETUP_GUIDE.md');
    console.log('   4. Restart server after fixing IPFS');
  }
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ip", ipRoutes);
app.use("/api/files", fileRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const ipfsStatus = await ipfsService.testConnection();
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        ipfs: ipfsStatus ? 'connected' : 'disconnected'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  
  // Test IPFS connection
  await testIPFSConnection();
});
