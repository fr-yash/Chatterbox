import dotenv from "dotenv";
dotenv.config();
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import { connectDB } from "./db/db.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.routes.js";
import cors from "cors";
import { app,io, server } from "./utils/socket.js";
import path from "path";

const port = process.env.PORT;
const __dirname = path.resolve();

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);

if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend","dist","index.html"));
  });
}

server.listen(port, () => {
  console.log(`app listening on port ${port}`);
  connectDB();
});
