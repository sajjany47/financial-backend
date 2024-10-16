import { StatusCodes } from "http-status-codes";

import mongoose from "mongoose";
import Loan from "./loan.model.js";
import employee from "../employess/employee.model.js";
import { Position } from "../employess/EmployeeConfig.js";

export const LoanManagList = async (req, res) => {
  try {
    const position = req.user;
    let reqData = req.body;
    const page = Number(req.body.page);
    const limit = Number(req.body.limit);
    const start = page * limit - limit;
    const searchQuery = [
      {
        isLoanActive:
          reqData.applicationStaus === "activeLoan" ||
          reqData.applicationStaus === "delinquentLoan"
            ? true
            : false,
      },
    ];
    if (reqData?.name) {
      searchQuery.push(BuildRegexQuery("name", reqData.name));
    }
    if (reqData?.applicationNumber) {
      searchQuery.push(
        BuildRegexQuery("applicationNumber", reqData.applicationNumber)
      );
    }
    if (reqData?.mobile) {
      searchQuery.push(BuildRegexQuery("mobile", reqData.mobile));
    }
    if (reqData?.loanType) {
      searchQuery.push({
        loanType: new mongoose.Types.ObjectId(reqData.loanType),
      });
    }
    if (reqData?.branch) {
      searchQuery.push({ branch: new mongoose.Types.ObjectId(reqData.branch) });
    }
    const query = [
      { $match: { $and: searchQuery } },
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
        $match: {
          "branchDetails.country": position?.country
            ? position?.country
            : { $ne: "" },
          "branchDetails.state": position.state ? position.state : { $ne: "" },
          "branchDetails.city": position.city ? position.city : { $ne: "" },
          "branchDetails.id": position.branch
            ? new mongoose.Types.ObjectId(position.branch)
            : { $ne: "" },
        },
      },
      {
        $addFields: {
          paidEmi: {
            $size: {
              $filter: {
                input: "$emiSchedule",
                as: "emi",
                cond: { $eq: ["$$emi.isPaid", true] },
              },
            },
          },
          unpaidEmi: {
            $size: {
              $filter: {
                input: "$emiSchedule",
                as: "emi",
                cond: { $eq: ["$$emi.isPaid", false] },
              },
            },
          },
          overDueEmi: {
            $size: {
              $filter: {
                input: "$emiSchedule",
                as: "emi",
                cond: {
                  $and: [
                    { $eq: ["$$emi.isPaid", false] },
                    { $lt: ["$$emi.emiDate", new Date()] },
                  ],
                },
              },
            },
          },
        },
      },

      {
        $lookup: {
          from: "employees",
          localField: "assignAgent",
          foreignField: "_id",
          as: "employeeDetails",
        },
      },
      {
        $unwind: {
          path: "$employeeDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          applicationNumber: 1,
          loanAmount: 1,
          paidEmi: 1,
          unpaidEmi: 1,
          overDueEmi: 1,
          emiDetails: "$emiSchedule",
          branchDetails: 1,
          mobile: 1,
          name: 1,
          EMIMonthly: 1,
          loanType: 1,
          assignAgent: "$employeeDetails.username",
          agentRemark: 1,
        },
      },
    ];
    const countData = await Loan.aggregate([
      ...query,
      {
        $count: "count",
      },
    ]);

    const data = await Loan.aggregate([
      ...query,
      {
        $sort: reqData.sort || { createdAt: 1 },
      },
      { $skip: start },
      { $limit: limit },
    ]);

    let modifyCount = countData.length > 0 ? countData[0].count : 0;
    let modifyData = data;
    if (reqData.applicationStaus === "delinquentLoan") {
      const filterData = data.filter((item) => item.overDueEmi !== 0);
      modifyCount = filterData.length;
      modifyData = filterData;
    }

    res.status(StatusCodes.OK).json({
      message: "Data fetched successfully",
      data: modifyData,
      total: modifyCount,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const AgentList = async (req, res) => {
  try {
    const id = req.params.id;
    const position = req.user;

    const list = await employee.aggregate([
      { $match: { branch: new mongoose.Types.ObjectId(id) } },
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
        $match: {
          "branchDetails.country": position?.country
            ? position?.country
            : { $ne: "" },
          "branchDetails.state": position.state ? position.state : { $ne: "" },
          "branchDetails.city": position.city ? position.city : { $ne: "" },
        },
      },
    ]);

    res.status(StatusCodes.OK).json({
      message: "Data fetched successfully",
      data: list,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const AddRemarkAgent = async (req, res) => {
  try {
    const reqData = req.body;
    if (reqData.type === "agent") {
      await Loan.updateOne(
        { _id: new mongoose.Types.ObjectId(reqData.loanId) },
        {
          $set: {
            assignAgent: new mongoose.Types.ObjectId(reqData.assignAgent),
            updatedBy: new mongoose.Types.ObjectId(req.user._id),
          },
        }
      );
    } else {
      await Loan.updateOne(
        { _id: new mongoose.Types.ObjectId(reqData.loanId) },
        {
          $push: {
            agentRemark: {
              _id: new mongoose.Types.ObjectId(),
              updatedBy: new mongoose.Types.ObjectId(req.user._id),
              updatedBy: null,
              date: new Date(),
              remark: reqData.agentRemark,
            },
          },
          $set: {
            updatedBy: req.user._id,
          },
        }
      );
    }

    res.status(StatusCodes.OK).json({
      message: `${
        reqData.type === "agent" ? "Agent assign " : "Remark add"
      } successfully`,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const RemarkDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Loan.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $project: {
          agentRemark: 1,
          loanId: "$_id",
          _id: 0,
        },
      },
      {
        $unwind: {
          path: "$agentRemark",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "employees",
          localField: "agentRemark.createdBy",
          foreignField: "_id",
          as: "employeeDetails",
        },
      },
      {
        $unwind: {
          path: "$employeeDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          loanId: 1,
          id: "$agentRemark._id",
          updatedBy: "$agentRemark.updatedBy",
          date: "$agentRemark.date",
          remark: "$agentRemark.remark",
          createdBy_name: "$employeeDetails.name",
          createdBy_username: "$employeeDetails.username",
        },
      },
      {
        $sort: {
          date: -1,
        },
      },
    ]);
    res.status(StatusCodes.OK).json({
      message: "Data fetched successfully",
      data: data,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};
