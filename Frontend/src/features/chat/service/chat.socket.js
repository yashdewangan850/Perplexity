import { io } from "socket.io-client";

let socket;

export const initializeSocketConnection = () => {
    if (socket) return socket;

    socket = io("https://perplexity-1-5xj4.onrender.com", {
        withCredentials: true,
        transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
        console.log("✅ Connected to Socket.IO server");
    });

    socket.on("connect_error", (err) => {
        console.error("❌ Socket Error:", err.message);
    });

    return socket;
};