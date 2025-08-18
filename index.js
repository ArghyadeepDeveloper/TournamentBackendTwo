import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./database/connection.js";
import { errorHandler } from "./lib/error.js";
import authRoutes from "./routes/auth.routes.js";
import tournamentRoutes from "./routes/tournament.routes.js";
import playerRoutes from "./routes/player.routes.js";
import { initSocket } from "./socket/index.js";
import transactionRoutes from "./routes/transaction.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/tournaments", tournamentRoutes);
app.use("/players", playerRoutes);
app.use("/transactions", transactionRoutes);
app.use("/users", userRoutes);
app.use(errorHandler);

// Init Socket.IO
initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
