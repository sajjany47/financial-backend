import { StatusCodes } from "http-status-codes";

import mongoose from "mongoose";
import Loan from "./loan.model.js";

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

    res.status(StatusCodes.OK).json({
      message: "Data fetched successfully",
      data: data,
      total: countData.length > 0 ? countData[0].count : 0,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};
