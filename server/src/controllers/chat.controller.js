import { MongooseError } from "mongoose";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { multerFileToBase64 } from "../lib/utils.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUsersForSidebar", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessagesBetweenUsers = async (req, res) => {
  try {
    const userToChatId = req.params.id;
    const userLoggedId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: userLoggedId, receiverId: userToChatId }, // This
        { senderId: userToChatId, receiverId: userLoggedId }, // Or vice-versa
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessagesBetweenUsers controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const image = req.file;
    const { text, id: receiverId } = req.body;
    const senderId = req.user._id;

    if (!receiverId) {
      return res.status(400).json({ message: "Missing receiver ID" });
    }

    // Try to get the user, if the ID is invalid, it throws an error
    let receiverUser = null;
    try {
      receiverUser = await User.findById(receiverId);
    } catch (error) {
      return res.status(400).json({ message: "Invalid receiver ID" });
    }

    if (!receiverUser) {
      return res.status(400).json({ message: "User not found" });
    }

    // Each messages requires an image, a text or both
    if (!image && !text) {
      return res
        .status(400)
        .json({ message: "Message missing image and text" });
    }

    let base64Image = null;
    if (image) {
      base64Image = multerFileToBase64(image);
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: base64Image
    });

    await newMessage.save();

    // TODO: real-time functionallity (socket.io)

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
