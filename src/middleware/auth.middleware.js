import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import employee from "../api/employess/employee.model.js";
import { generateAccessToken, generateRefreshToken } from "../utilis/utilis.js";

export const tokenValidation = async (req, res, next) => {
  const authToken = req.header("authorization");
  try {
    const token = authToken.split(" ")[1];
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    if (verifyToken) {
      const verifySession = await employee.findOne({
        _id: new mongoose.Types.ObjectId(verifyToken._id),
      });

      if (!verifySession) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Invalid session. User login first" });
      }

      if (verifySession.sessionId !== verifyToken.sessionId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Access Denied due to new login from another device.",
        });
      }

      req.user = verifyToken;
      next();
    } else {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "Invalid token" });
    }
  } catch (error) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Access Denied. No token provided." });
  }
};

export const refreshTokens = async (req, res, next) => {
  if (!req.user._id) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
  }

  try {
    const accessToken = generateAccessToken(req.user);
    const refreshToken = generateRefreshToken(req.user);
    return res
      .header("Authorization", `Bearer ${accessToken}`)
      .json({ accessToken: accessToken, refreshToken: refreshToken });
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json("Invalid refresh token.");
  }
};
