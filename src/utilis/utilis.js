import { nanoid } from "nanoid";
import nodemailer from "nodemailer";

export const url = "https://demo.com";

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

export const generatePassword = () => {
  const nanoidCharacters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  return nanoid(10, nanoidCharacters);
};

export const generateEmployeeId = () => {
  const nanoidCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  return nanoid(8, nanoidCharacters);
};

// export const generatePassword = () => {
//   const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789#@!-_";

//   const password = customAlphabet(alphabet, 8);

//   return password;
// };
