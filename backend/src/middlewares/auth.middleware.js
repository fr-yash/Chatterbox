import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.jwt;
  if(!token){
    return res.status(401).json({message: "Unauthorized - No token"});
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded){
      return res.status(401).json({message: "Unauthorized - Invalid token"});
    }
    const user = await User.findById(decoded.id).select("-password");
    if(!user){
      return res.status(401).json({message: "Unauthorized - User not found"});
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({message: "Unauthorized"});
  }
};

