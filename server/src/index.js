import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js"; // Local files need the .js extension
import { connectDB } from "./lib/db.js";

dotenv.config(); // Getting the content from .env
const PORT = process.env.PORT;

const app = express();

// need app.use(multer()); or something like that to upload files
app.use(express.json()); // Allows to extract the JSON from requests
app.use(cookieParser());
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`server is running on PORT:${PORT}`);
  connectDB();
});
