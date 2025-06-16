import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getUsersForSideBar, getMessages, sendMessage } from "../controllers/message.controller.js";

const messageRoutes = express.Router();

messageRoutes.get("/users", authMiddleware, getUsersForSideBar);
messageRoutes.get("/:id", authMiddleware, getMessages);
messageRoutes.post("/send/:id", authMiddleware, sendMessage);

export default messageRoutes;