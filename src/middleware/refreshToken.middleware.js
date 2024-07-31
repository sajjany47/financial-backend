import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import user from "../api/user/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utilis/utilis.js";

export const refreshToken = async (req, res) => {
  try {
    const refresh = req.body.refreshToken;

    const verifyToken = jwt.verify(refresh, process.env.SECRET_KEY);

    const verifySession = await user.findOne({
      sessionId: verifyToken.sessionId,
    });

    if (verifyToken.sessionId !== verifySession.sessionId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Access Denied" });
    }

    const accessToken = generateAccessToken(verifyToken);
    const refreshToken = generateRefreshToken(verifyToken);

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
