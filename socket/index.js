// socket.js
import { Server } from "socket.io";

const onlineUsers = {}; // { roomId: [ { userId, email, socketId } ] }

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    // Handle joining auction
    socket.on("join-auction", ({ roomId, userId, email }) => {
      socket.join(roomId);

      // Track user in room
      if (!onlineUsers[roomId]) {
        onlineUsers[roomId] = [];
      }
      onlineUsers[roomId].push({ userId, email, socketId: socket.id });

      console.log(`📢 ${email} joined ${roomId}`);

      // Notify room
      io.to(roomId).emit("user-joined", { userId, email });
      io.to(roomId).emit("online-users", onlineUsers[roomId]);
    });

    // Handle placing a bid
    socket.on("place-bid", (data) => {
      console.log(
        `💰 Bid in ${data.roomId}: ${data.amount} by ${data.user.email}`
      );
      io.to(data.roomId).emit("bid-updated", data);
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);

      // Remove user from all rooms
      for (const roomId in onlineUsers) {
        const userIndex = onlineUsers[roomId].findIndex(
          (u) => u.socketId === socket.id
        );

        if (userIndex !== -1) {
          const [leftUser] = onlineUsers[roomId].splice(userIndex, 1);

          // Notify room
          io.to(roomId).emit("user-left", leftUser);
          io.to(roomId).emit("online-users", onlineUsers[roomId]);
          console.log(`👋 ${leftUser.email} left ${roomId}`);
        }
      }
    });
  });

  return io;
};
