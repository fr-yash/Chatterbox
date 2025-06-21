import express from "express";
import { login, logout, signup, updateProfile, checkAuth } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateSignup, validateLogin, validateProfileUpdate } from "../middlewares/validation.middleware.js";

const authRoutes = express.Router();

authRoutes.post("/signup", validateSignup, signup);

authRoutes.post("/login", validateLogin, login);

authRoutes.post("/logout", logout);

authRoutes.put("/update-profile", authMiddleware, validateProfileUpdate, updateProfile);

authRoutes.get("/check-auth", authMiddleware, checkAuth);

export default authRoutes;
