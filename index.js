import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { connectDB } from "./database/connection.js";
import { errorHandler } from "./lib/error.js";
import authRoutes from "./routes/auth.routes.js";
import tournamentRoutes from "./routes/tournament.routes.js";
import playerRoutes from "./routes/player.routes.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  socket.on("join-auction", (roomId) => {
    socket.join(roomId);
    console.log(`📢 User ${socket.id} joined room ${roomId}`);
  });

  socket.on("place-bid", (data) => {
    console.log(`💰 Bid in ${data.roomId}: ${data.amount} by ${data.user}`);
    io.to(data.roomId).emit("bid-updated", data);
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

app.use("/auth", authRoutes);
app.use("/tournaments", tournamentRoutes);
app.use("/players", playerRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server is listening on port ${PORT}`);
});
