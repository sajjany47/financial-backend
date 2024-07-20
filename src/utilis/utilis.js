import { customAlphabet } from "nanoid";
import nodemailer from "nodemailer";

export const url = "https://demo.com";

import nodemailer from "nodemailer";

export const MailSend = async (data) => {
  const transporter = nodemailer.createTransport({
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

export const generateEmployeeId = () => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";

  const employeeId = customAlphabet(alphabet, 6);

  return employeeId.toUpperCase();
};

export const generatePassword = () => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789#@!-_";

  const password = customAlphabet(alphabet, 8);

  return password;
};
