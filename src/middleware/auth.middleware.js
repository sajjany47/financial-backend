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
    console.log(verifyToken);

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

    // Attach the verified token payload to the request object
    req.user = verifyToken;

    next();
  } catch (error) {
    let message = "Invalid token.";
    if (error.name === "TokenExpiredError") {
      message = "Token has expired.";
    } else if (error.name === "JsonWebTokenError") {
      message = "Token is malformed.";
    }
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: message, details: error.message });
  }
};
