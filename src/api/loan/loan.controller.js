import { StatusCodes } from "http-status-codes";
import {
  LeadSchema,
  PersonalLoanAccountSchema,
  PersonalLoanAddressSchema,
  PersonalLoanBasicSchema,
  PersonalLoanDocumentSchema,
  PersonalLoanWorkSchema,
} from "./loan.schema.js";
import Loan from "./loan.model.js";
import mongoose from "mongoose";
import { GenerateApplicationNumber } from "./loan.config.js";
import loanType from "../document/loanType.model.js";
import {
  AccountData,
  AddressData,
  BasicData,
  LeadData,
  WorkData,
} from "./PersonalLoan.js";
import { BuildRegexQuery } from "../../utilis/utilis.js";
import { Position } from "../employess/EmployeeConfig.js";

export const ApplicationCreate = async (req, res) => {
  try {
    const type = req.body.applicationType;
    const validationSchema =
      type === "lead"
        ? LeadSchema
        : type === "basic"
        ? PersonalLoanBasicSchema
        : "";
    const validateData = await validationSchema.validate(req.body);

    if (validateData) {
      const findLoanDetails = await loanType.findOne({
        _id: new mongoose.Types.ObjectId(validateData.loanType),
      });

      const data =
        type === "lead"
          ? LeadData(validateData)
          : type === "basic"
          ? BasicData(validateData)
          : "";
      const LeadCreate = new Loan({
        ...data,
        applicationNumber:
          validateData.applicationType === "lead"
            ? `L-${GenerateApplicationNumber(findLoanDetails.entity)}`
            : `${GenerateApplicationNumber(findLoanDetails.entity)}`,

        createdBy: req.user._id,
      });

      await LeadCreate.save();

      res.status(StatusCodes.OK).json({
        message: `${
          type === "lead" ? "Lead" : "Application"
        } created successfully`,
      });
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const ApplicationUpdate = async (req, res) => {
  try {
    const type = req.body.applicationType;
    const validationSchema =
      type === "lead"
        ? LeadSchema
        : type === "basic"
        ? PersonalLoanBasicSchema
        : type === "address"
        ? PersonalLoanAddressSchema
        : type === "work"
        ? PersonalLoanWorkSchema
        : type === "document"
        ? PersonalLoanDocumentSchema
        : type === "account"
        ? PersonalLoanAccountSchema
        : "";
    const validateData = await validationSchema.validate(req.body);
    if (validateData) {
      const data =
        type === "lead"
          ? LeadData(validateData)
          : type === "basic"
          ? BasicData(validateData)
          : type === "address"
          ? AddressData(validateData)
          : type === "work"
          ? WorkData(validateData)
          : type === "document"
          ? PersonalLoanDocumentSchema
          : type === "account"
          ? AccountData(validateData)
          : "";
      const updateData = await Loan.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(validateData._id) },
        { $set: { ...data, updatedBy: req.user._id } }
      );
      res.status(StatusCodes.OK).json({
        message: `${
          type === "lead" ? "Lead" : "Application"
        } updated successfully`,
      });
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const datatable = async (req, res, next) => {
  try {
    const reqData = req.body;
    const page = reqData.page;
    const limit = reqData.limit;
    const start = page * limit - limit;
    const query = [];
    const positionWise = [];

    if (reqData.searchText) {
      query.push(BuildRegexQuery("name", reqData.searchText));
      query.push(BuildRegexQuery("applicationNumber", reqData.searchText));
      query.push(BuildRegexQuery("mobile", reqData.searchText));
      query.push(BuildRegexQuery("email", reqData.searchText));
    }
    if (req.user.position !== Position.ADMIN) {
    }

    // [
    //   {
    //     $match: {
    //       $or: [{ name: { $regex: "^sa" } }],
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: "branches",
    //       localField: "branch",
    //       foreignField: "_id",
    //       as: "branchDetails"
    //     }
    //   },
    //   {
    //     $unwind: {
    //       path: "$branchDetails",
    //       preserveNullAndEmptyArrays: true
    //     }
    //   }
    // ]
  } catch (error) {
    next(error);
  }
};
