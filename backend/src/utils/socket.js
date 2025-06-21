import {Server} from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

// Parse CORS origins from environment variable for Socket.IO
const corsOrigins = process.env.FRONTEND_URLS 
  ? process.env.FRONTEND_URLS.split(',').map(url => url.trim())
  : process.env.NODE_ENV === 'production' 
    ? [] // No fallback in production - must be explicitly set
    : ["http://localhost:5173"]; // Development fallback

const io = new Server(server, {
  cors: {
    origin: corsOrigins,
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

export function getReciverSocketId(reciverId){
  return userSocketMap[reciverId];
}

const userSocketMap = {};

// Socket authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(" ")[1];
  
  if (!token) {
    return next(new Error('Authentication error: No token provided'));
  }
  
  try {
    // Verify token here if needed
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return next(new Error('Authentication error: Invalid token'));
  }
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  const userId = socket.handshake.query.userId;
  if(userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User ${userId} mapped to socket ${socket.id}`);
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
    if(userId) {
      delete userSocketMap[userId]; // Remove the user from the map when they disconnect
      console.log(`User ${userId} removed from socket map`);
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Emit the updated online users list
  });

  // Error handling for socket events
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

// Handle server errors
io.engine.on("connection_error", (err) => {
  console.error("Socket.IO connection error:", err);
});

export {io, server, app};
