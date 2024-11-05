import { StatusCodes } from "http-status-codes";
import finance from "./finance.model.js";
import { DataManage } from "./FinanceData.js";
import mongoose from "mongoose";
import { BuildRegexQuery } from "../../utilis/utilis.js";

export const financeCreate = async (req, res) => {
  try {
    const validData = await finance.validate(req.body);
    if (validData) {
      const prepareData = DataManage(validData);
      const data = new finance({ ...prepareData, createdBy: req.user._id });
      await data.save();

      return res
        .status(StatusCodes.OK)
        .json({ message: "Investor added successfully" });
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const financeUpdate = async (req, res) => {
  try {
    const validData = await finance.validate(req.body);
    if (validData) {
      const findInvestor = await finance.findOne({
        _id: new mongoose.Types.ObjectId(validData._id),
      });
      if (findInvestor) {
        const filterPayout = findInvestor.payoutSchedule.filter(
          (item) => item.isPaid === true
        );
        const data = DataManage(validData);
        await finance.updateOne(
          { _id: new mongoose.Types.ObjectId(validData._id) },
          {
            $set: {
              ...data,
              payoutSchedule: [...data.payoutSchedule, ...filterPayout],
              updatedBy: req.user._id,
            },
          }
        );
        return res
          .status(StatusCodes.OK)
          .json({ message: "Investor updated successfully" });
      } else {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Investor not founded" });
      }
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const financeGetDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const findData = await finance.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });

    return res
      .status(StatusCodes.OK)
      .json({ message: "Data fetched successfully", data: findData });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const InvestorDatatable = async (req, res) => {
  try {
    const reqData = req.body;
    const page = reqData.page;
    const limit = reqData.limit;
    const start = page * limit - limit;
    const query = [];
    if (reqData.name) {
      query.push(BuildRegexQuery("name", reqData.name));
    }
    if (reqData.investmentType) {
      query.push({ investmentType: reqData.investmentType });
    }
    if (reqData.payoutFrequency) {
      query.push({ payoutFrequency: reqData.payoutFrequency });
    }

    const data = await finance.aggregate([
      { $match: query.length > 0 ? { $and: query } : {} },
      {
        $facet: {
          count: [{ $count: "total" }],
          data: [
            {
              $sort: reqData.sort || { name: 1 },
            },
            { $skip: start },
            { $limit: limit },
          ],
        },
      },
    ]);

    return res.status(StatusCodes.OK).json({
      message: "Data fetched successfully",
      data: data[0].data,
      count: data[0].count[0] ? data[0].count[0].total : 0,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const PayoutDatable = async (req, res) => {
  try {
    const reqData = req.body;
    const page = reqData.page;
    const limit = reqData.limit;
    const start = page * limit - limit;
    const query = [
      { "payoutSchedule.isPaid": false },
      {
        "payoutSchedule.payoutDate": {
          $gte: new Date(req.body.startDate),
          $lte: new Date(req.body.endDate),
        },
      },
    ];

    if (reqData.name) {
      query.push(BuildRegexQuery("name", reqData.name));
    }

    const findQuery = [
      {
        $unwind: {
          path: "$payoutSchedule",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $match: query.length > 0 ? { $and: query } : {} },
    ];
    const countData = await finance.aggregate([
      ...findQuery,
      {
        $count: "count",
      },
    ]);

    const data = await finance.aggregate([
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
      count: countData.length > 0 ? countData[0].count : 0,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};
