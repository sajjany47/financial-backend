import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import employee from "../api/employess/employee.model.js";

export const tokenValidation = async (req, res, next) => {
  const authToken = req.header("authorization");

  if (!authToken || !authToken.startsWith("Bearer ")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Access Denied. No token provided." });
  }

  try {
    const token = authToken.split(" ")[1];

    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

    const verifySession = await employee.findOne({
      _id: new mongoose.Types.ObjectId(verifyToken._id),
    });

    if (!verifySession) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid token. User does not exist." });
    }

    if (verifySession.sessionId !== verifyToken.sessionId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Access Denied due to new login from another device.",
      });
    }

    req.user = verifyToken;

    next();
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error });
  }
};

export const generateRefreshToken = async (req, res, next) => {
  if (!req.user) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid token" });
  }

  try {
    const accessToken = generateAccessToken(req.user);
    const refreshToken = generateRefreshToken(req.user);
    return res
      .header("Authorization", `Bearer ${accessToken}`)
      .json({ accessToken: accessToken, refreshToken: refreshToken });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json("Invalid refresh token.");
  }
};
