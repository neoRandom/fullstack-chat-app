import jwt from "jsonwebtoken";

export const generateJWT = (userID, res) => {
  const token = jwt.sign({ userID }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie(process.env.JWT_COOKIE_NAME, token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // Milisseconds (7 days)
    httpOnly: true, // prevent XSS attacks
    sameSite: "strict", // prevent CSRF attacks
    secure: process.env.NODE_ENV !== "development", // HTTPS only
  });

  return token;
};

export const multerFileToBase64 = (file) => {
  // Check if the file is an image
  if (!file.mimetype.startsWith("image")) {
    return null
  }

  const fileContent = file.buffer.toString("base64");
  const mimeType = file.mimetype;
  
  return `data:${mimeType};base64,${fileContent}`;
};
