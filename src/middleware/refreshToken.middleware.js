import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import user from "../api/user/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utilis/utilis.js";

export const refreshToken = async (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Access Denied. No refresh token provided." });
  }
  try {
    const verifyToken = jwt.verify(refreshToken, process.env.SECRET_KEY);

    const verifySession = await user.findOne({
      sessionId: verifyToken.sessionId,
    });
    if (verifySession === undefined) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Access Denied" });
    }
    const accessToken = generateAccessToken(data);
    const refreshToken = generateRefreshToken(data);
    // const accessToken = jwt.sign(verifyToken, process.env.SECRET_KEY, {
    //   expiresIn: "1h",
    // });
    // const refreshToken = jwt.sign(verifyToken, process.env.SECRET_KEY, {
    //   expiresIn: "6h",
    // });
    return res
      .header("Authorization", `Bearer ${accessToken}`)
      .status(StatusCodes.OK)
      .json({
        message: "Token generated successfully",
        data: {
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Invalid refresh token.", details: error });
  }
};
