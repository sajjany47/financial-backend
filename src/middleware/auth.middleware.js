import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import user from "../api/user/user.model.js";

export const tokenValidation = async (req, res, next) => {
  const authToken = req.header("Authorization");
  if (!authToken) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Access Denied" });
  }
  try {
    const verifyToken = jwt.verify(authToken, process.env.SECRET_KEY);

    const verifySession = await user.findOne({
      sessionId: verifyToken.sessionId,
    });
    if (verifySession === undefined) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Access Denied" });
    }
    Object.assign(req, { user: verifyToken });
    next();
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Failed to verify token", details: error });
  }
};
