import { StatusCodes } from "http-status-codes";
import {
  accountDetailSchema20,
  adminSignUpSchema30,
  documentsSchema20,
  educationOrCompanyDetailSchema30,
} from "./employee.schema.js";
import {
  EmployeeDocumentImageUpload,
  EmployeeImageUpload,
  Position,
  Status,
} from "./EmployeeConfig.js";
import {
  BuildRegexQuery,
  generateAccessToken,
  generateEmployeeId,
  generatePassword,
  generateRefreshToken,
  GetFileName,
  GLocalImage,
  ImageUpload,
  MailSend,
} from "../../utilis/utilis.js";
import bcrypt from "bcrypt";
import { welcome } from "../../template/wlecome.js";
import mongoose from "mongoose";
import { nanoid } from "nanoid";
import employee from "./employee.model.js";
import { PersonalLoanAddressSchema } from "../loan/loan.schema.js";
import {
  EmployeeAccountData,
  EmployeeAddressData,
  EmployeeBasicData,
  EmployeeDocumentData,
} from "./EmployeeData.js";
import fs from "fs";

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

          fresherOrExperience: validatedUser.fresherOrExperience,
          password: await bcrypt.hash(password, 10),
          employeeId: employeeId,
          profileRatio: 20,
          approvedBy: req.user._id,
          isActive: true,
          createdBy: req.user._id,
          isProfileVerified: Status.PENDING,
          isPasswordReset: false,
          pageIndex: 0,
        };

        if (
          validatedUser.position === Position.ADMIN ||
          validatedUser.position === Position.SM ||
          validatedUser.position === Position.CM
        ) {
          if (validatedUser.position === Position.ADMIN) {
            userData.country = null;
            userData.state = null;
            userData.city = null;
            userData.branch = null;
          }
          if (validatedUser.position === Position.SM) {
            userData.country = validatedUser.country;
            userData.state = validatedUser.state;
            userData.city = null;
            userData.branch = null;
          }
          if (validatedUser.position === Position.CM) {
            userData.country = validatedUser.country;
            userData.state = validatedUser.state;
            userData.city = validatedUser.city;
            userData.branch = null;
          }
        } else {
          userData.country = validatedUser.country;
          userData.state = validatedUser.state;
          userData.city = validatedUser.city;
          userData.branch = validatedUser.branch;
        }

        if (req.files) {
          const file = req.files.userImage;
          const fileName = GetFileName(req.files.userImage);
          const uploadPath = GLocalImage(fileName, process.env.EMPLOYEE_PATH);

          await file.mv(uploadPath);
          // const file = req.files.userImage;
          // const imageUrl = await ImageUpload("user", file);
          userData.userImage = fileName;
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
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const updateEducationAndCompanyDetails = async (req, res) => {
  try {
    const validData = req.body;

    let reqData =
      req.body.dataType === "education"
        ? {
            boardName: validData.boardName,
            passingYear: validData.passingYear,
            marksPercentage: validData.marksPercentage,
            resultImage: validData.resultImage,
          }
        : {
            companyName: validData.companyName,
            position: validData.position,
            startingYear: validData.startingYear,
            endingYear: validData.endingYear,
            experienceLetter: validData.experienceLetter,
            relievingLetter: validData.relievingLetter,
            appointmentLetter: validData.appointmentLetter,
            salarySlip: validData.salarySlip,
          };
    if (req.files) {
      const findUser = await employee.findOne({
        _id: new mongoose.Types.ObjectId(validData.id),
      });
      if (req.body.dataType === "education") {
        if (req.files.resultImage) {
          const a = await EmployeeDocumentImageUpload(
            validData.actionType,
            validData.actionType !== "add" ? findUser?.education : [],
            validData.productId,
            validData.actionType !== "add" ? "resultImage" : "",
            req.files.resultImage
          );

          reqData.resultImage = a;
        }
      } else {
        if (req.files.experienceLetter) {
          const a = await EmployeeDocumentImageUpload(
            validData.actionType,
            validData.actionType !== "add" ? findUser?.workDetail : [],
            validData.productId,
            validData.actionType !== "add" ? "experienceLetter" : "",
            req.files.experienceLetter
          );

          reqData.experienceLetter = a;
        }
        if (req.files.relievingLetter) {
          const a = await EmployeeDocumentImageUpload(
            validData.actionType,
            validData.actionType !== "add" ? findUser?.workDetail : [],
            validData.productId,
            validData.actionType !== "add" ? "relievingLetter" : "",
            req.files.relievingLetter
          );
          reqData.relievingLetter = a;
        }
        if (req.files.appointmentLetter) {
          const a = await EmployeeDocumentImageUpload(
            validData.actionType,
            validData.actionType !== "add" ? findUser?.workDetail : [],
            validData.productId,
            validData.actionType !== "add" ? "appointmentLetter" : "",
            req.files.appointmentLetter
          );

          reqData.appointmentLetter = a;
        }
        if (req.files.salarySlip) {
          const a = await EmployeeDocumentImageUpload(
            validData.actionType,
            validData.actionType !== "add" ? findUser?.workDetail : [],
            validData.productId,
            validData.actionType !== "add" ? "salarySlip" : "",
            req.files.salarySlip
          );
          reqData.salarySlip = a;
        }
      }
    }

    const query =
      req.body.dataType === "education"
        ? { education: reqData }
        : { workDetail: reqData };

    if (validData.actionType === "add") {
      await employee.updateOne(
        {
          _id: new mongoose.Types.ObjectId(validData.id),
        },
        { $push: query, $set: { updatedBy: req.user._id } }
      );
    } else {
      const findQuery =
        validData.dataType === "education"
          ? {
              "education._id": new mongoose.Types.ObjectId(validData.productId),
            }
          : {
              "workDetail._id": new mongoose.Types.ObjectId(
                validData.productId
              ),
            };
      const updateQuery =
        req.body.dataType === "education"
          ? {
              "education.$.boardName": reqData.boardName,
              "education.$.passingYear": reqData.passingYear,
              "education.$.marksPercentage": reqData.marksPercentage,
              "education.$.resultImage": reqData.resultImage,
              updatedBy: req.user._id,
            }
          : {
              "workDetail.$.companyName": reqData.companyName,
              "workDetail.$.position": reqData.position,
              "workDetail.$.startingYear": reqData.startingYear,
              "workDetail.$.endingYear": reqData.endingYear,
              "workDetail.$.experienceLetter": reqData.experienceLetter,
              "workDetail.$.relievingLetter": reqData.relievingLetter,
              "workDetail.$.appointmentLetter": reqData.appointmentLetter,
              "workDetail.$.salarySlip": reqData.salarySlip,
              updatedBy: req.user._id,
            };
      await employee.updateOne(findQuery, { $set: updateQuery });
    }

    return res.status(StatusCodes.OK).json({
      message: "Data inserted successfully",
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const getDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const findData = await employee.findOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { password: 0 }
    );

    return res
      .status(StatusCodes.OK)
      .json({ message: "Data fetched successfully", data: findData });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const detailsUpdateUser = async (req, res) => {
  try {
    const selectValodation =
      req.body.dataType === "basic"
        ? adminSignUpSchema30
        : req.body.dataType === "educationAndWork"
        ? educationOrCompanyDetailSchema30
        : req.body.dataType === "document"
        ? documentsSchema20
        : req.body.dataType === "account"
        ? accountDetailSchema20
        : req.body.dataType === "address"
        ? PersonalLoanAddressSchema
        : "";
    // console.log(req.body);
    const validatedUser = await selectValodation.validate(req.body);

    const reqData =
      validatedUser.dataType === "basic"
        ? EmployeeBasicData(validatedUser)
        : validatedUser.dataType === "address"
        ? EmployeeAddressData(validatedUser)
        : validatedUser.dataType === "educationAndWork"
        ? {
            education: validatedUser.education,

            workDetail: validatedUser.workDetail,
            pageIndex: 2,
          }
        : validatedUser.dataType === "document"
        ? EmployeeDocumentData(validatedUser)
        : validatedUser.dataType === "account"
        ? EmployeeAccountData(validatedUser)
        : null;
    if (req.files) {
      const findUser = await employee.findOne({
        _id: new mongoose.Types.ObjectId(validatedUser.id),
      });
      if (req.files.userImage) {
        const a = await EmployeeImageUpload(
          findUser.userImage,
          req.files.userImage
        );

        reqData.userImage = a;
      }
      if (req.files.passportImage) {
        const a = await EmployeeImageUpload(
          findUser.passportImage,
          req.files.passportImage
        );

        reqData.passportImage = a;
      }
      if (req.files.voterImage) {
        const a = await EmployeeImageUpload(
          findUser.voterImage,
          req.files.voterImage
        );

        reqData.voterImage = a;
      }
      if (req.files.panImage) {
        const a = await EmployeeImageUpload(
          findUser.panImage,
          req.files.panImage
        );

        reqData.panImage = a;
      }
      if (req.files.aadharImage) {
        const a = await EmployeeImageUpload(
          findUser.aadharImage,
          req.files.aadharImage
        );

        reqData.aadharImage = a;
      }

      if (req.files.passbookImage) {
        const a = await EmployeeImageUpload(
          findUser.passbookImage,
          req.files.passbookImage
        );

        reqData.passbookImage = a;
      }
      if (req.files.uanImage) {
        const a = await EmployeeImageUpload(
          findUser.uanImage,
          req.files.uanImage
        );

        reqData.uanImage = a;
      }
    }

    const query = {
      ...reqData,
      profileRatio: validatedUser.profileRatio,
      updatedBy: req.user._id,
    };

    const updatedData = await employee.updateOne(
      {
        _id: new mongoose.Types.ObjectId(validatedUser.id),
      },
      { $set: query }
    );

    return res.status(StatusCodes.OK).json({
      message: "Data updated successfully",
      data: updatedData,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
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
            branch: validUser.branch,
            country: validUser.country,
            city: validUser.city,
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
            .json({ message: "Invalid password" });
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
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
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
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
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
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const ifsc = async (req, res) => {
  try {
    const searchCode = req.params.code;
    const response = await fetch(`https://ifsc.razorpay.com/${searchCode}`, {
      method: "GET",
    });

    const result = await response.json();

    return res.status(StatusCodes.OK).json({ data: result });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const dataTable = async (req, res) => {
  try {
    const reqData = req.body;
    const page = reqData.page;
    const limit = reqData.limit;
    const start = page * limit - limit;

    const query = [];
    if (reqData.name) {
      query.push(BuildRegexQuery("name", reqData.name));
    }
    if (reqData.position) {
      query.push(BuildRegexQuery("position", reqData.position));
    }
    if (reqData.branchCode) {
      query.push(BuildRegexQuery("branchCode", reqData.branchCode));
    }
    if (reqData.employeeId) {
      query.push(BuildRegexQuery("employeeId", reqData.employeeId));
    }
    if (reqData.username) {
      query.push(BuildRegexQuery("username", reqData.username));
    }
    if (reqData.isActive) {
      query.push({
        isActive: reqData.isActive,
      });
    }
    const findQuery = [
      {
        $lookup: {
          from: "branches",
          localField: "branch",
          foreignField: "_id",
          as: "branch",
        },
      },
      {
        $unwind: {
          path: "$branch",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          branch: "$branch.name",
          branchCode: "$branch.code",
          employeeId: 1,
          name: 1,
          username: 1,
          position: 1,
          isActive: 1,
        },
      },
      { $match: query.length > 0 ? { $and: query } : {} },
    ];
    const countData = await employee.countDocuments([...findQuery]);
    const data = await employee.aggregate([
      ...findQuery,
      {
        $sort: reqData.sort || { name: 1 },
      },

      { $skip: start },
      { $limit: limit },
    ]);

    return res.status(StatusCodes.OK).json({
      message: "Data fetched successfully",
      data: data,
      count: countData,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};
