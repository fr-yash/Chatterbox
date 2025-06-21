import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../utils/util.js";
import cloudinary from "../utils/cloudinary.js";

export const signup = async (req, res) => {
  const { fullname, email, password } = req.body;
  
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      fullname: fullname.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword
    });

    await newUser.save();

    // Generate token and send response
    generateToken(newUser, res);
    
    return res.status(201).json({
      _id: newUser._id,
      fullname: newUser.fullname,
      email: newUser.email,
      profilepic: newUser.profilepic,
      createdAt: newUser.createdAt,
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal Server Error' 
        : error.message 
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token and send response
    generateToken(user, res);
    
    return res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      profilepic: user.profilepic,
      createdAt: user.createdAt,
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal Server Error' 
        : error.message 
    });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal Server Error' 
        : error.message 
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilepic } = req.body;
    const userId = req.user._id;

    if (!profilepic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    // Upload to Cloudinary
    const uploadedPic = await cloudinary.uploader.upload(profilepic, {
      folder: 'profile-pics',
      transformation: [
        { width: 400, height: 400, crop: 'fill' },
        { quality: 'auto' }
      ]
    });

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilepic: uploadedPic.secure_url },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      _id: updatedUser._id,
      fullname: updatedUser.fullname,
      email: updatedUser.email,
      profilepic: updatedUser.profilepic,
      createdAt: updatedUser.createdAt,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal Server Error' 
        : error.message 
    });
  }
};

export const checkAuth = (req, res) => {
  try {
    return res.status(200).json({
      _id: req.user._id,
      fullname: req.user.fullname,
      email: req.user.email,
      profilepic: req.user.profilepic,
      createdAt: req.user.createdAt,
    });
  } catch (error) {
    console.error('Check auth error:', error);
    res.status(500).json({ 
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal Server Error' 
        : error.message 
    });
  }
};
