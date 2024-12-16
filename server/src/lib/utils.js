import jwt from "jsonwebtoken";

export const generateJWT = (userID, res) => {
  const token = jwt.sign({ userID }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie(process.env.JWT_COOKIE_NAME, token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // Milisseconds (7 days)
    httpOnly: true, // prevent XSS attacks
    sameSite: "strict",  // prevent CSRF attacks
    secure: process.env.NODE_ENV !== "development"  // HTTPS only
  });

  return token;
};
