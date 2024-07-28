import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

export const tokenValidation = (req, res, next) => {
  try {
    const authToken = req.header("Authorization");
    if (!authToken) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Access Denied" });
    }

    const verifyToken = jwt.verify(authToken, process.env.SECRET_KEY);
    Object.assign(req, { user: verifyToken });
    next();
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Failed to verify token", details: error });
  }
};
