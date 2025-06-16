import jwt from "jsonwebtoken";

export const generateToken = (user,res) => {
  const token = jwt.sign({id: user._id}, process.env.JWT_SECRET,{
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 7*24*60*60*1000),
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};