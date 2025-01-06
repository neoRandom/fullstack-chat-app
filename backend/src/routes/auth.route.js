import express from "express";
import multer from "multer";
import {
    signup,
    login,
    logout,
    updateProfile,
    checkAuth,
    getProfilePic,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const upload = multer();
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put(
    "/update-profile",
    upload.single("profilePic"),
    protectRoute,
    updateProfile
);

router.get("/check", protectRoute, checkAuth);
router.get("/profile-pic", protectRoute, getProfilePic);

export default router;
