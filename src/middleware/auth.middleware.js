import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import employee from "../api/employess/employee.model.js";
import { generateAccessToken, generateRefreshToken } from "../utilis/utilis.js";

export const tokenValidation = async (req, res, next) => {
  const authToken = req.header("authorization");

  if (typeof authToken !== "undefined") {
    const token = authToken.split(" ")[1];

    jwt.verify(token, process.env.SECRET_KEY, (err, result) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Invalid token. User does not exist" });
      }

      const verifySession = employee.findOne({
        _id: new mongoose.Types.ObjectId(result._id),
      });
      console.log(verifySession);
      console.log("d", verifySession.sessionId);
      console.log("l", result.sessionId);
      if (!verifySession) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Invalid session. User login first" });
      }

      if (verifySession.sessionId !== result.sessionId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Access Denied due to new login from another device.",
        });
      }

      req.user = result;

      next();
    });
  } else {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Access Denied. No token provided." });
  }
};

export const refreshTokens = async (req, res, next) => {
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
    console.log("object");
    return res.status(StatusCodes.BAD_REQUEST).json("Invalid refresh token.");
  }
};
