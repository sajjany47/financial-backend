import { StatusCodes } from "http-status-codes";
import {
  adminSignUpSchema30,
  documentsSchema20,
  educationOrCompanyDetailSchema30,
} from "./user.schema.js";
import user from "./user.model.js";
import { Status } from "./UserConfig.js";
import {
  generateEmployeeId,
  generatePassword,
  MailSend,
} from "../../utilis/utilis.js";
import bcrypt from "bcrypt";
import { welcome } from "../../template/wlecome.js";
import nodemailer from "nodemailer";
import mongoose from "mongoose";

export const adminSignUpSchemaFirst = async (req, res) => {
  try {
    const validatedUser = await adminSignUpSchema30.validate(req.body);
    if (validatedUser) {
      const isValid = await user.findOne({ username: validatedUser.username });

      if (!isValid) {
        const password = generatePassword();

        const employeeId = generateEmployeeId();

        const userData = new user({
          name: validatedUser.name,
          username: validatedUser.username,
          mobile: validatedUser.mobile,
          email: validatedUser.email,
          dob: validatedUser.dob,
          position: validatedUser.position,
          address: validatedUser.address,
          state: validatedUser.state,
          country: validatedUser.country,
          city: validatedUser.city,
          pincode: validatedUser.pincode,
          password: bcrypt.hash(password, 10),
          employeeId: employeeId,
          isProfileVerified: Status.PENDING,
          profileRatio: "30%",
          approvedBy: req.id,
          isActive: true,
          createdBy: req.id,
          isProfileVerified: Status.PENDING,
        });

        const saveUser = await userData.save();
        if (saveUser) {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
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
            to: validatedUser.email,
            subject: "Registration Successfully",
            html: welcome({
              sender: "Sajjan",
              name: validatedUser.name,
              username: validatedUser.username,
              password: password,
            }),
          });

          // const mailSend = await MailSend({
          //   to: [validatedUser.email],
          //   subject: "Registration Successfully",
          //   html: welcome({
          //     sender: req.name,
          //     username: validatedUser.username,
          //     password: password,
          //   }),
          // });
        }
        return res
          .status(StatusCodes.OK)
          .json({ message: "User created successfully" });
      } else {
        return res
          .status(StatusCodes.CONFLICT)
          .json({ message: "Username already exists" });
      }
    } else {
      return res.status(StatusCodes.BAD_REQUEST);
    }
  } catch (error) {
    res.status(StatusCodes.BAD_GATEWAY).json(error.message);
  }
};

export const updateEducationDetails = async (req, res) => {
  try {
    const validatedUser = await educationOrCompanyDetailSchema30.validate(
      req.body
    );
    if (validatedUser) {
      const checkUser = await user.findOne({
        _id: new mongoose.Types.ObjectId(validatedUser.id),
      });
      if (checkUser) {
        const reqData = {
          education: validatedUser.education,
          fresherOrExperience: validatedUser.fresherOrExperience,
          workDetail: validatedUser.workDetail,
          profileRatio: "60%",
          updatedBy: req.id,
        };

        const updateUser = await user.updateOne(
          {
            _id: new mongoose.Types.ObjectId(validatedUser.id),
          },
          { $set: reqData }
        );
        return res
          .status(StatusCodes.OK)
          .json({ message: "User updated successfully" });
      } else {
        res.status(StatusCodes.NOT_FOUND).json({ message: "User not found!" });
      }
    }
  } catch (error) {
    res.status(StatusCodes.BAD_GATEWAY).json(error.message);
  }
};

export const updateDocumentDetails = async (req, res) => {
  try {
    const validatedUser = await documentsSchema20.validate(req.body);
    if (validatedUser) {
      const checkUser = await user.findOne({
        _id: new mongoose.Types.ObjectId(validatedUser.id),
      });
      if (checkUser) {
        const reqData = {
          aadharNumber: validatedUser.aadharNumber,
          voterNumber: validatedUser.voterNumber,
          panNumber: validatedUser.panNumber,
          passportNumber: validatedUser.passportNumber,
          profileRatio: "80%",
          updatedBy: req.id,
        };

        const updateUser = await user.updateOne(
          {
            _id: new mongoose.Types.ObjectId(validatedUser.id),
          },
          { $set: reqData }
        );
        return res
          .status(StatusCodes.OK)
          .json({ message: "User updated successfully" });
      } else {
        res.status(StatusCodes.NOT_FOUND).json({ message: "User not found!" });
      }
    }
  } catch (error) {
    res.status(StatusCodes.BAD_GATEWAY).json(error.message);
  }
};

export const updateAccountDetails = async (req, res) => {
  try {
    const validatedUser = await documentsSchema20.validate(req.body);
    if (validatedUser) {
      const checkUser = await user.findOne({
        _id: new mongoose.Types.ObjectId(validatedUser.id),
      });
      if (checkUser) {
        const reqData = {
          bankName: validatedUser.bankName,
          accountNumber: validatedUser.accountNumber,
          branchName: validatedUser.branchName,
          passportNumber: validatedUser.passportNumber,
          profileRatio: "100%",
          updatedBy: req.id,
        };

        const updateUser = await user.updateOne(
          {
            _id: new mongoose.Types.ObjectId(validatedUser.id),
          },
          { $set: reqData }
        );
        return res
          .status(StatusCodes.OK)
          .json({ message: "User updated successfully" });
      } else {
        res.status(StatusCodes.NOT_FOUND).json({ message: "User not found!" });
      }
    }
  } catch (error) {
    res.status(StatusCodes.BAD_GATEWAY).json(error.message);
  }
};
