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
      },
    });
  } catch (err) {
    console.error("Update Profile Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};
