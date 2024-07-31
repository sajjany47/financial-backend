import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import user from "../api/user/user.model.js";

export const tokenValidation = async (req, res, next) => {
  const authToken = req.header("authorization");
  if (!authToken) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Access Denied" });
  }
  try {
    const token = authToken && authToken.split(" ")[1];
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    const verifySession = await user.findOne({
      sessionId: verifyToken.sessionId,
    });
    if (verifyToken.sessionId !== verifySession.sessionId) {
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
