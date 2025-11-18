import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  linkWallet,
  unlinkWallet,
  getWalletStatus,
} from "../controllers/authController.js";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/profile", auth, getUserProfile);
router.put("/profile", auth, updateUserProfile);

// Wallet management routes
router.post("/wallet/link", auth, linkWallet);
router.post("/wallet/unlink", auth, unlinkWallet);
router.get("/wallet/status", auth, getWalletStatus);

export default router;
