import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { client } from "../config/twilio.js";

// Generate access token
export const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};

// Verify the access token
export const verifyAccessToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return reject(err);
      resolve(user);
    });
  });
};

// Set cookie
export const setCookie = (
  res,
  cookieName,
  cookieValue,
  // maxAge = 24 * 60 * 60 * 1000,
  maxAge = 30 * 24 * 60 * 60 * 1000
) => {
  res.cookie(cookieName, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: maxAge,
    sameSite: "strict",
  });
};

// Hash password
export const hashPassword = async (enteredPassword) =>
  await bcrypt.hash(enteredPassword, 12);

// Verify password
export const verifyPassword = async (enteredPassword, hashedPassword) =>
  await bcrypt.compare(enteredPassword, hashedPassword);

export const sendOTP = async (to) => {
  try {
    const response = await client.verify.v2
      .services(process.env.TWILIO_SERVICE_SID)
      .verifications.create({
        to: `+91 ${to}`,
        channel: "sms",
      });
    return response;
  } catch (error) {
    console.log(`Error sending otp: ${error}`);
  }
};

export const verifyOTP = async (to, otp) => {
  try {
    const response = await client.verify.v2
      .services(process.env.TWILIO_SERVICE_SID)
      .verificationChecks.create({
        to: `+91 ${to}`,
        code: otp,
      });
    return response;
  } catch (error) {
    console.log(`Error verifying otp: ${error}`);
    throw error;
  }
};
