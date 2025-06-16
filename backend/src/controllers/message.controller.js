import User from "../models/user.model.js";
import Message from "../models/messages.model.js";
import cloudinary from "../utils/cloudinary.js";
import { io, getReciverSocketId } from "../utils/socket.js";

export const getUsersForSideBar = async (req, res) => {
  try {
    const users = await User.find({
      _id: {$ne: req.user._id},
    }).select("-password");
    return res.status(200).json(users);
  } catch (error) {
    res.status(500).json({message: "Internal Sever error"}); 
  }
};

export const getMessages = async (req, res) => {
  try {
    const {id:userToChat} = req.params;
    const messages = await Message.find({
      $or: [
        {senderId: req.user._id, reciverId: userToChat},
        {senderId: userToChat, reciverId: req.user._id},
      ],
    })
    return res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({message: "Internal Sever error"}); 
  }
};

export const sendMessage = async (req, res) => {
  try {
    const {id:recieverId} = req.params;
    const {text, image} = req.body;
    if(!text && !image){
      return res.status(400).json({message: "Message text or image is required"});
    }
    let imageUrl;
    if(image){
      const uploadedImage = await cloudinary.uploader.upload(image);
      imageUrl = uploadedImage.secure_url;
    }

    const newMessage = new Message({
      senderId: req.user._id,
      reciverId: recieverId,
      text,
      image: imageUrl,
    });

    if(!newMessage){
      return res.status(400).json({message: "Something went wrong"});
    }

    await newMessage.save();
    const reciverSocketId = getReciverSocketId(recieverId);
    if(reciverSocketId){
      io.to(reciverSocketId).emit("newMessage", newMessage);
    }
    return res.status(201).json(newMessage);
    
  }catch (error) {
    res.status(500).json({message: "Internal Sever error"}); 
  }
};

