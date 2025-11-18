import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const registerUser = async (req, res) => {
  const { name, email, phone, country, address, dob, password } = req.body;

  try {
    console.log("🔧 Register request received:", req.body);

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      phone,
      country,
      address,
      dateOfBirth: dob, // ✅ Mapped correctly
      password: hashed,
    });

    console.log("✅ User registered:", newUser);
    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    console.error("🔥 Server error during registration:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        country: user.country,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        bio: user.bio || "",
        walletAddress: user.walletAddress || null,
        walletLinkedAt: user.walletLinkedAt || null,
      },
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        country: user.country,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        bio: user.bio || "",
        walletAddress: user.walletAddress || null,
        walletLinkedAt: user.walletLinkedAt || null,
      },
    });
  } catch (err) {
    console.error("Get Profile Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { name, email, phone, country, address, dateOfBirth, bio } = req.body;

    // Check if email is being changed and if it already exists
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== req.user.id) {
        return res.status(400).json({ msg: "Email already exists" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(country && { country }),
        ...(address && { address }),
        ...(dateOfBirth && { dateOfBirth }),
        ...(bio !== undefined && { bio }), // Allow empty string for bio
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      msg: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        country: updatedUser.country,
        address: updatedUser.address,
        dateOfBirth: updatedUser.dateOfBirth,
        bio: updatedUser.bio || "",
        walletAddress: updatedUser.walletAddress || null,
        walletLinkedAt: updatedUser.walletLinkedAt || null,
      },
    });
  } catch (err) {
    console.error("Update Profile Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Link MetaMask wallet to user account
export const linkWallet = async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ msg: "Wallet address is required" });
    }

    // Validate Ethereum address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return res.status(400).json({ msg: "Invalid Ethereum address format" });
    }

    const normalizedAddress = walletAddress.toLowerCase();

    // Check if wallet is already linked to another user
    const existingWallet = await User.findOne({ 
      walletAddress: normalizedAddress,
      _id: { $ne: req.user.id }
    });

    if (existingWallet) {
      return res.status(400).json({ 
        msg: "This wallet is already linked to another account",
        error: "WALLET_ALREADY_LINKED"
      });
    }

    // Check if current user already has a wallet linked
    const currentUser = await User.findById(req.user.id);
    if (currentUser.walletAddress && currentUser.walletAddress !== normalizedAddress) {
      return res.status(400).json({ 
        msg: "You already have a different wallet linked. Please unlink it first.",
        error: "WALLET_ALREADY_EXISTS"
      });
    }

    // Link the wallet
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        walletAddress: normalizedAddress,
        walletLinkedAt: new Date(),
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      msg: "Wallet linked successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        walletAddress: updatedUser.walletAddress,
        walletLinkedAt: updatedUser.walletLinkedAt,
      },
    });
  } catch (err) {
    console.error("Link Wallet Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Unlink MetaMask wallet from user account
export const unlinkWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.walletAddress) {
      return res.status(400).json({ msg: "No wallet linked to this account" });
    }

    // Unlink the wallet
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        walletAddress: null,
        walletLinkedAt: null,
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      msg: "Wallet unlinked successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        walletAddress: null,
        walletLinkedAt: null,
      },
    });
  } catch (err) {
    console.error("Unlink Wallet Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get wallet status
export const getWalletStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("walletAddress walletLinkedAt");

    res.status(200).json({
      isLinked: !!user.walletAddress,
      walletAddress: user.walletAddress || null,
      linkedAt: user.walletLinkedAt || null,
    });
  } catch (err) {
    console.error("Get Wallet Status Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};
