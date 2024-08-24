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
  try {
    const token = authToken.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          // Token has expired, send 403 to indicate refresh token needed
          return res
            .status(StatusCodes.FORBIDDEN)
            .json({ message: "Token expired. Please refresh your token." });
        } else {
          // Invalid token
          return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ message: "Invalid token. Access Denied." });
        }
      }
      req.user = decodedToken;
      const verifySession = await employee.findOne({
        _id: new mongoose.Types.ObjectId(req.user._id),
      });

      if (!verifySession) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Invalid session. Please login first." });
      }

      if (verifySession.sessionId !== req.user.sessionId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Access Denied due to new login from another device.",
        });
      }

      next(); // Proceed to the next middleware or route handler
    });
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Access Denied. Invalid or expired token." });
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
    return res.status(StatusCodes.BAD_REQUEST).json("Invalid refresh token.");
  }
};
