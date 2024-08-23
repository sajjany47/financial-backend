import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import employee from "../api/employess/employee.model.js";
import { generateAccessToken, generateRefreshToken } from "../utilis/utilis.js";

export const tokenValidation = async (req, res, next) => {
  const authToken = req.header("authorization");
  try {
    const token = authToken.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, result) => {
      if (err) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ message: "Invalid token" });
      }
      req.user = result;
    });
    console.log(req.user);
    const verifySession = await employee.findOne({
      _id: new mongoose.Types.ObjectId(req.user._id),
    });

    if (!verifySession) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid session. User login first" });
    }

    if (verifySession.sessionId !== req.user.sessionId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Access Denied due to new login from another device.",
      });
    }
    next();
  } catch (error) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Access Denied. No token provided." });
  }
};

export const refreshTokens = async (req, res, next) => {
  try {
    const authToken = req.header("authorization");
    const token = authToken.split(" ")[1];
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

    const accessToken = generateAccessToken(verifyToken);
    const refreshToken = generateRefreshToken(verifyToken);

    res
      .header("Authorization", `Bearer ${accessToken}`)
      .json({ accessToken: accessToken, refreshToken: refreshToken });

    req.user = verifyToken;
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json("Invalid refresh token.");
  }
};
