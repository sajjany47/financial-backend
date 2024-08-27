import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import employee from "../api/employess/employee.model.js";
import { generateAccessToken, generateRefreshToken } from "../utilis/utilis.js";

export const tokenValidation = async (req, res, next) => {
  const authToken = req.header("authorization");

  if (!authToken) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Access Denied. No token provided." });
  }

  const token = authToken.split(" ")[1];

  jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ message: "Token expired. Please refresh your token." });
      } else {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Invalid token. Access Denied." });
      }
    }

    try {
      const verifySession = await employee.findOne({
        _id: new mongoose.Types.ObjectId(decodedToken._id),
      });

      if (!verifySession) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Invalid session. Please login first." });
      }

      if (verifySession.sessionId !== decodedToken.sessionId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Access Denied due to new login from another device.",
        });
      }

      req.user = decodedToken;
      next();
    } catch (error) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Access Denied. Invalid or expired token." });
    }
  });
};

export const refreshTokens = async (req, res, next) => {
  const authToken = req.header("authorization");

  if (!authToken) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "No refresh token provided." });
  }

  const token = authToken.split(" ")[1];

  jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
    if (err) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid refresh token." });
    }

    try {
      const verifySession = await employee.findOne({
        _id: new mongoose.Types.ObjectId(decodedToken._id),
      });

      if (!verifySession) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Invalid session. Please login first." });
      }

      if (verifySession.sessionId !== decodedToken.sessionId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Access Denied due to new login from another device.",
        });
      }
      const accessToken = generateAccessToken(decodedToken);
      const refreshToken = generateRefreshToken(decodedToken);
      req.user = decodedToken;
      res
        .header("Authorization", `Bearer ${accessToken}`)
        .json({ accessToken, refreshToken });
    } catch (error) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Failed to generate tokens." });
    }
  });
};
