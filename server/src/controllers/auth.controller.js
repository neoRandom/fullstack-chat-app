import bcrypt from "bcryptjs";
import { generateJWT } from "../lib/utils.js";
import User from "../models/user.model.js";

export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateJWT(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller,", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateJWT(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller,", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (_req, res) => {
  try {
    res.cookie(process.env.JWT_COOKIE_NAME, "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller,", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const profilePic = req.file;

    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No User Defined" });
    }

    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    if (profilePic.size > 4 * 1024 * 1024) {
      return res.status(400).json({ message: "Image too large" });
    }

    const fileContent = profilePic.buffer.toString("base64");
    const mimeType = profilePic.mimetype;
    const base64Image = `data:${mimeType};base64,${fileContent}`;

    await User.findOneAndUpdate(
      { _id: req.user._id }, 
      { profilePic: base64Image }
    );

    res.status(200).json({ image: base64Image });
  } catch (error) {
    console.log("Error in update profile controller,", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
