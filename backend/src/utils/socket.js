import {Server} from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

export function getReciverSocketId(reciverId){
  return userSocketMap[reciverId];
}

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  const userId = socket.handshake.query.userId;
  if(userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
    if(userId) delete userSocketMap[userId]; // Remove the user from the map when they disconnect
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Emit the updated online users list
  });
});

export {io, server, app};
