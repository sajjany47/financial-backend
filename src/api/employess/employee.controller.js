import { StatusCodes } from "http-status-codes";
import {
  adminSignUpSchema30,
  documentsSchema20,
  educationOrCompanyDetailSchema30,
} from "./employee.schema.js";
import { Status } from "./EmployeeConfig.js";
import {
  generateAccessToken,
  generateEmployeeId,
  generatePassword,
  generateRefreshToken,
  getCircularReplacer,
  ImageUpload,
  MailSend,
} from "../../utilis/utilis.js";
import bcrypt from "bcrypt";
import { welcome } from "../../template/wlecome.js";
import mongoose from "mongoose";
import { nanoid } from "nanoid";
import axios from "axios";
import employee from "./employee.model.js";

export const adminSignUpSchemaFirst = async (req, res) => {
  try {
    const validatedUser = await adminSignUpSchema30.validate(req.body);

    if (validatedUser) {
      const isValid = await employee.findOne({
        username: validatedUser.username,
      });

      if (!isValid) {
        const password = generatePassword();
        const employeeId = generateEmployeeId();

        let userData = {
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
          jobBranchName: validatedUser.jobBranchName,
          password: await bcrypt.hash(password, 10),
          employeeId: employeeId,
          isProfileVerified: Status.PENDING,
          profileRatio: "30%",
          approvedBy: req.user._id,
          isActive: true,
          createdBy: req.user._id,
          isProfileVerified: Status.PENDING,
          isPasswordReset: false,
        };

        if (req.files) {
          const file = req.files.userImage;
          const imageUrl = await ImageUpload("user", file);
          userData.userImage = imageUrl;
        }

        const createUser = new employee(userData);

        const saveUser = await createUser.save();
        if (saveUser) {
          await MailSend({
            to: [validatedUser.email],
            subject: "Registration Successfully",
            html: welcome({
              sender: req.user.name,
              name: validatedUser.name,
              username: validatedUser.username,
              password: password,
            }),
          });
        }
        return res
          .status(StatusCodes.OK)
          .json({ message: "User created successfully", data: saveUser });
      } else {
        return res
          .status(StatusCodes.CONFLICT)
          .json({ message: "Username already exists" });
      }
    }
  } catch (error) {
    res.status(StatusCodes.BAD_GATEWAY).json({
      message: error,
    });
  }
};

export const updateBasicDetails = async (req, res) => {
  try {
    const validatedUser = await adminSignUpSchema30.validate(req.body);

    if (validatedUser) {
      const isValid = await employee.findOne({
        _id: new new mongoose.Types.ObjectId(validatedUser.id)(),
      });

      if (isValid) {
        const userData = {
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
          jobBranchName: validatedUser.jobBranchName,
          password: await bcrypt.hash(password, 10),
          employeeId: validatedUser.employeeId,
          isProfileVerified: Status.PENDING,
          profileRatio: "30%",
          updatedBy: req.user._id,
        };

        const updateUser = await employee.updateOne(
          { _id: new new mongoose.Types.ObjectId(validatedUser.id)() },
          { $set: userData }
        );

        return res
          .status(StatusCodes.OK)
          .json({ message: "User created successfully" });
      } else {
        return res
          .status(StatusCodes.CONFLICT)
          .json({ message: "Username already exists" });
      }
    }
  } catch (error) {
    res.status(StatusCodes.BAD_GATEWAY).json({
      message: error,
    });
  }
};

export const updateEducationDetails = async (req, res) => {
  try {
    const validatedUser = await educationOrCompanyDetailSchema30.validate(
      req.body
    );
    if (validatedUser) {
      const checkUser = await employee.findOne({
        _id: new mongoose.Types.ObjectId(validatedUser.id),
      });
      if (checkUser) {
        const reqData = {
          education: validatedUser.education,
          fresherOrExperience: validatedUser.fresherOrExperience,
          workDetail: validatedUser.workDetail,
          profileRatio: "60%",
          updatedBy: req.user._id,
        };

        const updateUser = await employee.updateOne(
          {
            _id: new mongoose.Types.ObjectId(validatedUser.id),
          },
          { $set: reqData }
        );
        console.log(updateUser);
        return res
          .status(StatusCodes.OK)
          .json({ message: "User updated successfully", data: updateUser });
      } else {
        res.status(StatusCodes.NOT_FOUND).json({ message: "User not found!" });
      }
    }
  } catch (error) {
    res.status(StatusCodes.BAD_GATEWAY).json({
      mesaage: error,
    });
  }
};

export const updateDocumentDetails = async (req, res) => {
  try {
    const validatedUser = await documentsSchema20.validate(req.body);
    if (validatedUser) {
      const checkUser = await employee.findOne({
        _id: new mongoose.Types.ObjectId(validatedUser.id),
      });
      if (checkUser) {
        const reqData = {
          aadharNumber: validatedUser.aadharNumber,
          voterNumber: validatedUser.voterNumber,
          panNumber: validatedUser.panNumber,
          passportNumber: validatedUser.passportNumber,
          profileRatio: "80%",
          updatedBy: req.user._id,
        };

        const updateUser = await employee.updateOne(
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
    res.status(StatusCodes.BAD_GATEWAY).json({
      mesaage: error,
    });
  }
};

export const updateAccountDetails = async (req, res) => {
  try {
    const validatedUser = await documentsSchema20.validate(req.body);
    if (validatedUser) {
      const checkUser = await employee.findOne({
        _id: new mongoose.Types.ObjectId(validatedUser.id),
      });
      if (checkUser) {
        const reqData = {
          bankName: validatedUser.bankName,
          accountNumber: validatedUser.accountNumber,
          branchName: validatedUser.branchName,
          ifsc: validatedUser.ifsc,
          profileRatio: "100%",
          updatedBy: req.user._id,
        };

        const updateUser = await employee.updateOne(
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
    res.status(StatusCodes.BAD_GATEWAY).json({
      mesaage: error,
    });
  }
};

export const login = async (req, res) => {
  try {
    const reqData = req.body;

    const validUser = await employee.findOne({ username: reqData.username });
    if (validUser) {
      if (validUser.isActive) {
        const verifyPassword = await bcrypt.compare(
          reqData.password,
          validUser.password
        );
        if (verifyPassword) {
          const sessionID = nanoid();
          const data = {
            _id: validUser._id,
            username: validUser.username,
            name: validUser.name,
            position: validUser.position,
            jobBranchName: validUser.jobBranchName,
            country: validUser.country,
            state: validUser.state,
            isPasswordReset: validUser.isPasswordReset,
            sessionId: sessionID,
          };
          const accessToken = generateAccessToken(data);
          const refreshToken = generateRefreshToken(data);
          // req.session.userId = validUser._id;

          await employee.updateOne(
            { _id: new mongoose.Types.ObjectId(validUser._id) },
            { $set: { sessionId: sessionID } }
          );

          return res
            .header("Authorization", accessToken)
            .status(StatusCodes.OK)
            .json({
              message: "Data fetched successfully",
              data: {
                data: data,
                accessToken: accessToken,
                refreshToken: refreshToken,
              },
            });
        } else {
          return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ message: "invalid password" });
        }
      } else {
        return res
          .status(StatusCodes.LOCKED)
          .json({ message: "Contact with admin" });
      }
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found!" });
    }
  } catch (error) {
    return res.status(StatusCodes.BAD_GATEWAY).json({
      mesaage: error,
      // details: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const reqData = req.body;

    const updatedPassword = await employee.updateOne(
      { _id: new mongoose.Types.ObjectId(reqData.id) },
      {
        $set: {
          password: await bcrypt.hash(reqData.password, 10),
          isPasswordReset: true,
        },
      }
    );
    if (updatedPassword) {
      return res
        .status(StatusCodes.OK)
        .json({ message: "Password updated successfully" });
    } else {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid user or Password" });
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      mesaage: error,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const removeSessionId = await employee.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
      {
        $unset: {
          sessionId: "",
        },
      }
    );

    return res.status(StatusCodes.OK).json({ message: "Logout successfully" });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error });
  }
};

export const country = async (req, res) => {
  try {
    const countryList = await axios.get(
      `https://api.countrystatecity.in/v1/countries`,
      {
        headers: {
          "X-CSCAPI-KEY":
            "OU5ycmZrek91NnpXVjdUTVJoUVZ1N3ZWWWJGM3lnQVB0N0djYngzMA==",
        },
      }
    );

    const jsonString = JSON.stringify(countryList, getCircularReplacer());

    res.status(StatusCodes.OK).json({
      message: "Data fetched successfully successfully",
      data: JSON.parse(jsonString).data,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error });
  }
};

export const state = async (req, res) => {
  try {
    const countryList = await axios.get(
      `https://api.countrystatecity.in/v1/countries/${req.body.country}/states`,
      {
        headers: {
          "X-CSCAPI-KEY":
            "OU5ycmZrek91NnpXVjdUTVJoUVZ1N3ZWWWJGM3lnQVB0N0djYngzMA==",
        },
      }
    );

    const jsonString = JSON.stringify(countryList, getCircularReplacer());

    res.status(StatusCodes.OK).json({
      message: "Data fetched successfully successfully",
      data: JSON.parse(jsonString).data,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error });
  }
};

export const city = async (req, res) => {
  try {
    const countryList = await axios.get(
      `https://api.countrystatecity.in/v1/countries/${req.body.country}/states/${req.body.state}/cities`,
      {
        headers: {
          "X-CSCAPI-KEY":
            "OU5ycmZrek91NnpXVjdUTVJoUVZ1N3ZWWWJGM3lnQVB0N0djYngzMA==",
        },
      }
    );

    const jsonString = JSON.stringify(countryList, getCircularReplacer());

    res.status(StatusCodes.OK).json({
      message: "Data fetched successfully successfully",
      data: JSON.parse(jsonString).data,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error });
  }
};

export const findIFSC = async (req, res) => {
  try {
    const countryList = await axios.get(
      `https://ifsc.razorpay.com/${req.body.ifsc}`
    );

    const jsonString = JSON.stringify(countryList, getCircularReplacer());

    res.status(StatusCodes.OK).json({
      message: "Data fetched successfully successfully",
      data: JSON.parse(jsonString).data,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error });
  }
};
