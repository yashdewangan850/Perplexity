import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import chatRouter from "./routes/chat.routes.js";
import authRouter from "./routes/auth.routes.js";
import morgan from "morgan";

const app = express();

// CORS Middleware (Routes se pehle)
app.use(
  cors({
    origin:[ "http://localhost:5173",
     "https://your-frontend.onrender.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/chats", chatRouter);

export default app;