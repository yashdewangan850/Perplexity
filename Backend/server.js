import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import http from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "https://perplexity-2-1cpi.onrender.com",
];

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

connectDB().catch((err) => {
  console.error("MongoDB connection failed:", err);
  process.exit(1);
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});