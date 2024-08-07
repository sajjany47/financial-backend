import { nanoid } from "nanoid";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export const url = "https://demo.com";

export const generateAccessToken = (data) => {
  const a = {
    _id: data._id,
    username: data.username,
    position: data.position,
    jobBranchName: data.jobBranchName,
    country: data.country,
    state: data.state,
    isPasswordReset: data.isPasswordReset,
    sessionId: data.sessionId,
  };
  const accessToken = jwt.sign(a, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });

  return accessToken;
};

export const generateRefreshToken = (data) => {
  const a = {
    _id: data._id,
    username: data.username,
    position: data.position,
    jobBranchName: data.jobBranchName,
    country: data.country,
    state: data.state,
    isPasswordReset: data.isPasswordReset,
    sessionId: data.sessionId,
  };
  const refreshToken = jwt.sign(a, process.env.SECRET_KEY, {
    expiresIn: "6h",
  });

  return refreshToken;
};

export const MailSend = async (data) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.ethereal.email",
    port: process.env.PORT,
    secure: false,
    auth: {
      user: process.env.USER,
      pass: process.env.USER_PASSWORD,
    },
  });

  const send = await transporter.sendMail({
    from: process.env.SEND_MAIL,
    // to: "bar@example.com, baz@example.com", list should be like this
    to: data.to,
    subject: data.subject,
    html: data.html,
  });

  return send;
};

export const generatePassword = () => {
  const nanoidCharacters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return nanoid(10, nanoidCharacters);
};

export const generateEmployeeId = () => {
  const nanoidCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  return nanoid(8, nanoidCharacters).toUpperCase();
};

export const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};
