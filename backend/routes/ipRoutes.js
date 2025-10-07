import express from 'express';
import {
  registerIP,
  getUserIPs,
  getIPDetails,
  updateIPStatus,
  deleteIP,
  getIPStats,
  getUserStats,
  getPublicIPs
} from '../controllers/ipController.js';
import {auth} from '../middlewares/authMiddleware.js';
import IP from '../models/IPModel.js';

const router = express.Router();

// @route   GET /api/ip/marketplace
// @desc    Get all public IPs for marketplace (no auth required)
// @access  Public
router.get('/marketplace', getPublicIPs);

// @route   GET /api/ip/debug-all
// @desc    Debug endpoint to check all IPs (no auth required)
// @access  Public
router.get('/debug-all', async (req, res) => {
  try {
    const allIPs = await IP.find({}).select('title isPublic status').limit(10);
    const publicCount = await IP.countDocuments({ isPublic: true });
    const totalCount = await IP.countDocuments();
    
    console.log('🔍 Debug - Total IPs:', totalCount);
    console.log('🔍 Debug - Public IPs:', publicCount);
    console.log('🔍 Debug - Sample IPs:', allIPs);
    
    res.json({
      success: true,
      totalIPs: totalCount,
      publicIPs: publicCount,
      sampleIPs: allIPs
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// All other routes require authentication
router.use(auth);

// @route   POST /api/ip/register
// @desc    Register a new IP
// @access  Private
router.post('/register', registerIP);

// @route   GET /api/ip/list
// @desc    Get all IPs for authenticated user
// @access  Private
router.get('/list', getUserIPs);

// @route   GET /api/ip/stats
// @desc    Get IP statistics for authenticated user
// @access  Private
router.get('/stats', getIPStats);

// @route   GET /api/ip/user-stats
// @desc    Get user profile statistics
// @access  Private
router.get('/user-stats', getUserStats);

// @route   GET /api/ip/:id
// @desc    Get single IP details
// @access  Private
router.get('/:id', getIPDetails);

// @route   PUT /api/ip/:id
// @desc    Update IP status/details
// @access  Private
router.put('/:id', updateIPStatus);

// @route   DELETE /api/ip/:id
// @desc    Delete an IP
// @access  Private
router.delete('/:id', deleteIP);
export default router;