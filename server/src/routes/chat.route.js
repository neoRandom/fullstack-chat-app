import express from "express";
import multer from "multer";
import {
  getMessagesBetweenUsers,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/chat.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const upload = multer();
const router = express.Router();

router.post("/send-message", upload.single("image"), protectRoute, sendMessage);

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/messages/:id", protectRoute, getMessagesBetweenUsers);

export default router;
