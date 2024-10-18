import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

// const generateRefreshToken = (user) => {
//   return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
//     expiresIn: "1d",
//   });
// };

const setCookie = (
  res,
  cookieName,
  cookieValue,
  maxAge = 24 * 60 * 60 * 1000
) => {
  res.cookie(cookieName, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: maxAge,
    sameSite: "strict",
  });
};

const verifyPassword = async (passwordEntered, hashedPassword) =>
  await bcrypt.compare(passwordEntered, hashedPassword);

const hashPassword = async (passwordEntered) =>
  await bcrypt.hash(passwordEntered, 12);

export { generateAccessToken, setCookie, verifyPassword, hashPassword };
