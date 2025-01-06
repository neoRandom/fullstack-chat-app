import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import chatRoutes from "./routes/chat.route.js";
import { connectDB } from "./lib/db.js";

import { app, server } from "./lib/socket.js";

dotenv.config(); // Getting the content from .env
const PORT = process.env.PORT;

app.use(express.json()); // Allows to extract the JSON from requests
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

server.listen(PORT, () => {
    console.log(`server is running on PORT:${PORT}`);
    connectDB();
});
