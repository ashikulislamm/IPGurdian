import express from 'express';
import {
  registerIP,
  getUserIPs,
  getIPDetails,
  updateIPStatus,
  deleteIP,
  getIPStats,
  getUserStats
} from '../controllers/ipController.js';
import {auth} from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes require authentication
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