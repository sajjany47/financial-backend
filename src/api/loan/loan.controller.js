import { StatusCodes } from "http-status-codes";
import {
  ApplicationStatusSchema,
  LeadSchema,
  PersonalLoanAccountSchema,
  PersonalLoanAddressSchema,
  PersonalLoanBasicSchema,
  PersonalLoanDocumentSchema,
  PersonalLoanWorkSchema,
} from "./loan.schema.js";
import Loan from "./loan.model.js";
import mongoose from "mongoose";
import {
  DisbursmentCalculate,
  EMICalculator,
  GenerateApplicationNumber,
} from "./loan.config.js";
import loanType from "../document/loanType.model.js";
import {
  AccountData,
  AddressData,
  BasicData,
  LeadData,
  StatusData,
  WorkData,
} from "./PersonalLoan.js";
import { BuildRegexQuery, GetFileName } from "../../utilis/utilis.js";
import { Position } from "../employess/EmployeeConfig.js";
import fs from "fs";
import charges from "../charges/charges.model.js";

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
        loanAllotAgent: req.user._id,
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
        : type === "status"
        ? ApplicationStatusSchema
        : "";
    const validateData = await validationSchema.validate(req.body);
    if (validateData) {
      if (validateData.status === "disbursed") {
        const findCharges = await charges.findOne({ isActive: true });
        const findLoanApplication = await Loan.findOne({
          _id: new mongoose.Types.ObjectId(validateData._id),
        });
        validateData = {
          ...validateData,
          charges: findCharges
            ? findCharges
            : {
                processingFees: 0,
                processingFeesGST: 0,
                loginFees: 0,
                loginFeesGST: 0,
                otherCharges: 0,
                otherChargesGST: 0,
              },
          interestRate: findLoanApplication.interestRate,
          loanAmount: findLoanApplication.loanAmount,
          loanTenure: findLoanApplication.loanTenure,
        };
      }
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
          ? {
              applicationStaus: "incompleted",
              activeIndex: 3,
              status: "incompleted",
            }
          : type === "account"
          ? AccountData(validateData)
          : type === "status"
          ? StatusData({ ...validateData, user: req.user._id })
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

    const baseUrl = req.protocol + "://" + req.get("host");

    if (details[0].document) {
      details[0].document = details[0].document.map((item) => {
        const entityKey = Object.keys(item)[1];
        item.entity = entityKey;
        if (item[entityKey] && item[entityKey].documentImage) {
          item[
            entityKey
          ].documentUrl = `${baseUrl}/uploads/${item[entityKey].documentImage}`;
        }
        return item;
      });
    }

    res.status(StatusCodes.OK).json({
      data: details[0],
      message: `Data fetched successfully`,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const documentDelete = async (req, res, next) => {
  try {
    const deleteDocument = await Loan.updateOne(
      {
        _id: new mongoose.Types.ObjectId(req.body._id),
      },
      {
        $set: { updatedBy: req.user._id },
        $pull: {
          document: { _id: new mongoose.Types.ObjectId(req.body.documentId) },
        },
      }
    );
    if (deleteDocument) {
      await fs.promises.unlink("./src/uploads/" + req.body.doumentImage);
    }

    res
      .status(StatusCodes.OK)
      .json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const documentUpload = async (req, res, next) => {
  try {
    let reqData = req.body;
    let data = {
      documentType: reqData.documentType,
      documentNumber: reqData.documentNumber,
    };

    if (req.files) {
      const file = req.files.documentImage;

      const fileName = GetFileName(file);
      await file.mv("./src/uploads/" + fileName);
      data = { ...data, documentImage: fileName };
    }
    await Loan.updateOne(
      { _id: new mongoose.Types.ObjectId(reqData._id) },
      {
        $set: { updatedBy: req.user._id },
        $push: {
          document: {
            _id: new mongoose.Types.ObjectId(),
            [reqData.entity]: data,
          },
        },
      }
    );

    res
      .status(StatusCodes.OK)
      .json({ message: "Application updated successfully" });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const documentUpdate = async (req, res, next) => {
  try {
    let reqData = req.body;
    let data = {
      documentType: reqData.documentType,
      documentImage: reqData.documentImage,
      documentNumber: reqData.documentNumber,
    };

    if (req.files) {
      const findDocument = await Loan.findOne({
        _id: new mongoose.Types.ObjectId(reqData._id),
        // "document._id": new mongoose.Types.ObjectId(reqData.documentId),
      });

      if (findDocument) {
        const findDocumentImage = findDocument.document.find(
          (item) => item._id.toString() === reqData.documentId
        );
        const documentImagePath =
          findDocumentImage[reqData.entity].documentImage;
        await fs.promises.unlink("./src/uploads/" + documentImagePath);
      }

      const file = req.files.documentImage;
      const fileName = GetFileName(file);
      const filePath = "./src/uploads/" + fileName;

      await file.mv(filePath);
      data = { ...data, documentImage: fileName };
    }

    const a = await Loan.updateOne(
      { "document._id": new mongoose.Types.ObjectId(reqData.documentId) },
      {
        $set: {
          [`document.$.${reqData.entity}.documentType`]: data.documentType,
          [`document.$.${reqData.entity}.documentImage`]: data.documentImage,
          [`document.$.${reqData.entity}.documentNumber`]: data.documentNumber,
          updatedBy: req.user._id,
        },
      }
    );

    res
      .status(StatusCodes.OK)
      .json({ message: "Application updated successfully" });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const applicationDelete = async (req, res) => {
  try {
    const findApplication = await Loan.findOne({
      _id: new mongoose.Types.ObjectId(req.body._id),
    });

    if (findApplication) {
      if (findApplication?.document.length > 0) {
        for (let index = 0; index < findApplication?.document.length; index++) {
          const element = findApplication?.document[index];
          const deleteKey = Object.keys(element)[1];

          await fs.promises.unlink(
            "./src/uploads/" + element[deleteKey].documentImage
          );
        }
      }
      const deleteApplication = await Loan.findOneAndDelete({
        _id: new mongoose.Types.ObjectId(req.body._id),
      });
    }

    res
      .status(StatusCodes.OK)
      .json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const getEMIDetails = async (req, res) => {
  try {
    const findCharges = await charges.findOne({ isActive: true });

    const fixedCharges = findCharges
      ? findCharges
      : {
          processingFees: 0,
          processingFeesGST: 0,
          loginFees: 0,
          loginFeesGST: 0,
          otherCharges: 0,
          otherChargesGST: 0,
          foreclosureFees: 0,
          foreclosureFeesGST: 0,
        };

    const EMI = EMICalculator({
      loanAmount: Number(req.body.loanAmount),
      interestRate: Number(req.body.interestRate),
      loanTenure: Number(req.body.loanTenure),
      foreclosureFees: fixedCharges.foreclosureFees,
      foreclosureFeesGST: fixedCharges.foreclosureFeesGST,
    });

    const disbursment = DisbursmentCalculate({
      processingFees: fixedCharges.processingFees,
      processingFeesGST: fixedCharges.processingFeesGST,
      loginFees: fixedCharges.loginFees,
      loginFeesGST: fixedCharges.loginFeesGST,
      otherCharges: fixedCharges.otherCharges,
      otherChargesGST: fixedCharges.otherChargesGST,
      loanAmount: Number(req.body.loanAmount),
    });

    res.status(StatusCodes.OK).json({
      message: "Data fetched successfully",
      data: {
        loanAmount: Number(req.body.loanAmount),
        interestRate: Number(req.body.interestRate),
        loanTenure: Number(req.body.loanTenure),
        EMIMonthly: EMI.emi,
        emiSchedule: EMI.emiSchedule,
        disbursment: disbursment,
      },
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
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
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};
