import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getUsersForSideBar, getMessages, sendMessage } from "../controllers/message.controller.js";
import { validateMessage } from "../middlewares/validation.middleware.js";

const messageRoutes = express.Router();

messageRoutes.get("/users", authMiddleware, getUsersForSideBar);
messageRoutes.get("/:id", authMiddleware, getMessages);
messageRoutes.post("/send/:id", authMiddleware, validateMessage, sendMessage);

export default messageRoutes;