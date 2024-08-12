import { StatusCodes } from "http-status-codes";
import {
  adminSignUpSchema30,
  documentsSchema20,
  educationOrCompanyDetailSchema30,
} from "./user.schema.js";
import user from "./user.model.js";
import { Status } from "./UserConfig.js";
import {
  generateAccessToken,
  generateEmployeeId,
  generatePassword,
  generateRefreshToken,
  getCircularReplacer,
  MailSend,
} from "../../utilis/utilis.js";
import bcrypt from "bcrypt";
import { welcome } from "../../template/wlecome.js";
import mongoose from "mongoose";
// import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";

export const adminSignUpSchemaFirst = async (req, res) => {
  try {
    // const validatedUser = await adminSignUpSchema30.validate(req.body);
    const validatedUser = req.body;
    const file = req.files.userImage;
    //configuration
    cloudinary.config({
      cloud_name: "dzezstvvt",
      api_key: "574439343664656",
      api_secret: "gZ_wMx84XjXuYdfzOAt1M03njRA",
    });

    cloudinary.uploader
      .upload(file.tempFilePath, {
        folder: "user",
        resource_type: "image",
      })
      .then(console.log);

    // Upload an image
    // const uploadResult = await cloudinary.uploader
    //   .upload(req.files.userImage, {
    //     public_id: "profile",
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    // console.log(uploadResult);

    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url(file.tempFilePath, {
      fetch_format: "auto",
      quality: "auto",
    });

    console.log(optimizeUrl);

    // Transform the image: auto-crop to square aspect_ratio
    // const autoCropUrl = cloudinary.url("shoes", {
    //   crop: "auto",
    //   gravity: "auto",
    //   width: 500,
    //   height: 500,
    // });

    // console.log(autoCropUrl);

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
          jobBranchName: validatedUser.jobBranchName,
          password: await bcrypt.hash(password, 10),
          employeeId: employeeId,
          isProfileVerified: Status.PENDING,
          profileRatio: "30%",
          approvedBy: req.id,
          isActive: true,
          createdBy: req.id,
          isProfileVerified: Status.PENDING,
          isPasswordReset: false,
        });

        const saveUser = await userData.save();
        if (saveUser) {
          await MailSend({
            to: [validatedUser.email],
            subject: "Registration Successfully",
            html: welcome({
              sender: req.name,
              name: validatedUser.name,
              username: validatedUser.username,
              password: password,
            }),
          });
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
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Failed to create user" });
    }
  } catch (error) {
    res.status(StatusCodes.BAD_GATEWAY).json({
      message: "Something went wrong to create user",
      details: error.message,
    });
  }
};

export const updateBasicDetails = async (req, res) => {
  try {
    const validatedUser = await adminSignUpSchema30.validate(req.body);

    if (validatedUser) {
      const isValid = await user.findOne({
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
          employeeId: employeeId,
          isProfileVerified: Status.PENDING,
          profileRatio: "30%",
          updatedBy: req.id,
        };

        const updateUser = await user.updateOne(
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
    } else {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Failed to create user" });
    }
  } catch (error) {
    res.status(StatusCodes.BAD_GATEWAY).json({
      message: "Something went wrong to create user",
      details: error.message,
    });
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
    res.status(StatusCodes.BAD_GATEWAY).json({
      mesaage: "Failed to update user details",
      details: error.message,
    });
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
    res.status(StatusCodes.BAD_GATEWAY).json({
      mesaage: "Failed to update user details",
      details: error.message,
    });
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
          ifsc: validatedUser.ifsc,
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
    res.status(StatusCodes.BAD_GATEWAY).json({
      mesaage: "Failed to update user details",
      details: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const reqData = req.body;

    const validUser = await user.findOne({ username: reqData.username });
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

          await user.updateOne(
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
      mesaage: "Failed to user login",
      details: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const reqData = req.body;

    const updatedPassword = await user.updateOne(
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
      mesaage: "Failed to update user password",
      details: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const removeSessionId = await user.findOneAndUpdate(
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
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Failed to Logout user", details: error.message });
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
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Failed to fetch data", details: error.message });
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
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Failed to fetch data", details: error.message });
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
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Failed to fetch data", details: error.message });
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
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Failed to fetch data", details: error.message });
  }
};
