import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../utils/util.js";
import cloudinary from "../utils/cloudinary.js";

export const signup = async (req, res) => {

  const { fullname, email, password } = req.body;
  try {
    if(!fullname || !email || !password){
      return res.status(400).json({message: "All fields are required"});
    }
    if(password.length<6){
      return res.status(400).json({message: "Password must be at least 6 characters"});
    }

    const user = await User.findOne({email});
    if(user){
      return res.status(400).json({message: "User already exists"});
    }
    //hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = new User({fullname, email, password: hashedPassword});

    if(newUser){
      // TODO: Implement generateToken function
      generateToken(newUser, res);
      await newUser.save();
      return res.status(201).json({
        _id:newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        profilepic: newUser.profilepic,
        createdAt: newUser.createdAt,
      });
    }else{
      return res.status(400).json({message: "Something went wrong"});
    }

  } catch (error) {
    res.status(500).json({message: "Internal Sever error"}); 
  }
};

export const login = async (req, res) => {
  const {email , password} = req.body;
  try {
    if(!email || !password){
      return res.status(400).json({message: "All fields are required"});
    }

    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({message: "User does not exist"});
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if(!isMatch){
      return res.status(400).json({message: "Invalid credentials"});
    }
    // TODO: Implement generateToken function
    generateToken(user, res);
    return res.status(200).json({
      _id:user._id,
      fullname: user.fullname,
      email: user.email,
      profilepic: user.profilepic,
      createdAt: user.createdAt,
    });

  } catch (error) {
    res.status(500).json({message: "Internal Sever error"}); 
  }

};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt",{
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });
    return res.status(200).json({message: "Logged out successfully"});
  } catch (error) {
    res.status(500).json({message: "Internal Sever error"}); 
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {profilepic} = req.body;
    const userId = req.user._id;

    if(!profilepic){
      return res.status(400).json({message: "Profile picture is required"});
    }

    const uploadedPic = await cloudinary.uploader.upload(profilepic);

    const user = await User.findByIdAndUpdate(userId, 
      {profilepic: uploadedPic.secure_url,},
      {new: true}
    );

    if(!user){
      return res.status(400).json({message: "Something went wrong"});
    }

    return res.status(200).json({
      _id:user._id,
      fullname: user.fullname,
      email: user.email,
      profilepic: user.profilepic,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({message: "Internal Sever error"}); 
  }
};

export const checkAuth = (req, res) => {
  try {
    return res.status(200).json({
      _id:req.user._id,
      fullname: req.user.fullname,
      email: req.user.email,
      profilepic: req.user.profilepic,
      createdAt: req.user.createdAt,
    });
  } catch (error) {
    res.status(500).json({message: "Internal Sever error"}); 
  }
};
