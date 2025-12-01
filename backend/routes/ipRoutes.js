import express from "express";
import {
  registerIP,
  getUserIPs,
  getIPDetails,
  updateIPStatus,
  deleteIP,
  getIPStats,
  getUserStats,
  getPublicIPs,
} from "../controllers/ipController.js";
import { auth } from "../middlewares/authMiddleware.js";
import IP from "../models/IPModel.js";

const router = express.Router();

// @route   GET /api/ip/marketplace
router.get("/marketplace", getPublicIPs);

// @route   GET /api/ip/debug-all
router.get("/debug-all", async (req, res) => {
  try {
    const allIPs = await IP.find({}).select("title isPublic status").limit(10);
    const publicCount = await IP.countDocuments({ isPublic: true });
    const totalCount = await IP.countDocuments();

    console.log("🔍 Debug - Total IPs:", totalCount);
    console.log("🔍 Debug - Public IPs:", publicCount);
    console.log("🔍 Debug - Sample IPs:", allIPs);

    res.json({
      success: true,
      totalIPs: totalCount,
      publicIPs: publicCount,
      sampleIPs: allIPs,
    });
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// All other routes require authentication
router.use(auth);

// @route   GET /api/ip/nft-ready
//          Get confirmed IPs eligible for NFT minting (not yet minted)
router.get('/nft-ready', async (req, res) => {
  try {
    // Updated eligibility logic:
    // Show all user-owned, public IPs that are not yet minted and not failed.
    // Include both 'confirmed' and 'pending' so new registrations appear immediately.
    const ips = await IP.find({
      userId: req.user._id,
      isPublic: true,
      status: { $in: ['confirmed', 'pending'] },
      nftTokenId: { $in: [null, undefined] }
    })
    .select('title description ipType category registrationDate transactionHash status isPublic');

    res.json({
      success: true,
      ips
    });
  } catch (error) {
    console.error('NFT-ready IP fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch NFT-ready IPs', error: error.message });
  }
});

// @route POST /api/ip/migrate-eligibility
// Sets isEligibleForNFT=true for all public confirmed or pending IPs without NFT
router.post('/migrate-eligibility', async (req, res) => {
  try {
    const result = await IP.updateMany({
      isPublic: true,
      status: { $in: ['confirmed', 'pending'] },
      nftTokenId: { $in: [null, undefined] },
      isEligibleForNFT: { $ne: true }
    }, {
      $set: { isEligibleForNFT: true }
    });

    res.json({ success: true, updated: result.modifiedCount });
  } catch (e) {
    console.error('Eligibility migration error:', e);
    res.status(500).json({ success: false, message: e.message });
  }
});

// @route   POST /api/ip/register
router.post("/register", registerIP);

// @route   GET /api/ip/list

router.get("/list", getUserIPs);

// @route   GET /api/ip/stats

router.get("/stats", getIPStats);

// @route   GET /api/ip/user-stats

router.get("/user-stats", getUserStats);

// @route   GET /api/ip/:id

router.get("/:id", getIPDetails);

// @route   PUT /api/ip/:id

router.put("/:id", updateIPStatus);

// @route   DELETE /api/ip/:id

router.delete("/:id", deleteIP);
export default router;
