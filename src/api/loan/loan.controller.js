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

      const applicationSave = await LeadCreate.save();

      res.status(StatusCodes.OK).json({
        data: applicationSave,
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
        data: updateData,
        message: `${
          type === "lead" ? "Lead" : "Application"
        } updated successfully`,
      });
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const getLoanDetail = async (req, res, next) => {
  try {
    const id = req.params.id;
    const details = await Loan.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "branches",
          localField: "branch",
          foreignField: "_id",
          as: "branchDetails",
        },
      },
      {
        $unwind: {
          path: "$branchDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "loantypes",
          localField: "loanType",
          foreignField: "_id",
          as: "loanDetails",
        },
      },
      {
        $unwind: {
          path: "$loanDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    res.status(StatusCodes.OK).json({
      data: details[0],
      message: `Data fetched successfully`,
    });
  } catch (error) {
    next(error);
  }
};

export const datatable = async (req, res, next) => {
  try {
    const reqData = req.body;
    const page = Number(reqData.page);
    const limit = Number(reqData.limit);
    const start = page * limit - limit;
    const query = [];
    const positionWise = [];
    const postion = req.user.position;
    if (reqData.searchText) {
      query.push(BuildRegexQuery("name", reqData.searchText));
      query.push(BuildRegexQuery("applicationNumber", reqData.searchText));
      query.push(BuildRegexQuery("mobile", reqData.searchText));
      query.push(BuildRegexQuery("email", reqData.searchText));
    }
    if (postion === Position.SM) {
      positionWise.push({ "branchDetails.country": req.user.country });
      positionWise.push({ "branchDetails.state": req.user.state });
    }
    if (postion === Position.CM) {
      positionWise.push({ "branchDetails.country": req.user.country });
      positionWise.push({ "branchDetails.state": req.user.state });
      positionWise.push({ "branchDetails.city": req.user.city });
    }

    if (
      postion === Position.BM ||
      postion === Position.LM ||
      postion === Position.LD ||
      postion === Position.VD
    ) {
      positionWise.push({
        branch: new mongoose.Types.ObjectId(req.user.branch),
      });
    }

    const queryHandel =
      query.length > 0
        ? {
            applicationStaus: reqData.applicationStaus,
            $or: query,
          }
        : {
            applicationStaus: reqData.applicationStaus,
          };

    const findQuery = [
      {
        $match: queryHandel,
      },
      {
        $lookup: {
          from: "branches",
          localField: "branch",
          foreignField: "_id",
          as: "branchDetails",
        },
      },
      {
        $unwind: {
          path: "$branchDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "loantypes",
          localField: "loanType",
          foreignField: "_id",
          as: "loanDetails",
        },
      },
      {
        $unwind: {
          path: "$loanDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: positionWise.length > 0 ? { $and: positionWise } : {},
      },
    ];

    const countData = await Loan.aggregate([
      ...findQuery,
      { $count: "totalCount" },
    ]);
    const totalCount = countData.length > 0 ? countData[0].totalCount : 0;

    const data = await Loan.aggregate([
      ...findQuery,
      {
        $sort: reqData.sort || { createdAt: 1 },
      },
      { $skip: start },
      { $limit: limit },
    ]);

    return res.status(StatusCodes.OK).json({
      message: "Data fetched successfully",
      data: data,
      count: totalCount,
    });
  } catch (error) {
    next(error);
  }
};
