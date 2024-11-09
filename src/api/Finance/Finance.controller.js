import { StatusCodes } from "http-status-codes";
import finance from "./finance.model.js";
import { DataManage, GeneratePayout } from "./FinanceData.js";
import mongoose from "mongoose";
import { BuildRegexQuery } from "../../utilis/utilis.js";
import {
  financeSchema,
  payNowSchema,
  reedemApplySchema,
} from "./finance.schema.js";
import { PayoutFrequencies } from "./Finance.Config.js";

export const financeCreate = async (req, res) => {
  try {
    const validData = await financeSchema.validate(req.body);
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
    const validData = await financeSchema.validate(req.body);
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

export const financePayNow = async (req, res) => {
  try {
    const validData = await payNowSchema.validate(req.body);
    if (validData) {
      const findInvestor = await finance.findOne({ _id: validData._id });
      if (findInvestor) {
        let reqData = {};
        if (validData.type === "payout") {
          reqData = {
            "payoutSchedule.$.isPaid": true,
            "payoutSchedule.$.transactionNumber": validData.transactionNumber,
            "payoutSchedule.$.paidBy": new mongoose.Types.ObjectId(
              req.user._id
            ),
            "payoutSchedule.$.paidOn": new Date(),
            updatedBy: new mongoose.Types.ObjectId(req.user._id),
          };

          const filterPayout = findInvestor.payoutSchedule.filter(
            (item) => item.isPaid === false
          );
          if (filterPayout.length === 0) {
            reqData.isMaturityCompleted = true;
          } else {
            reqData.isMaturityCompleted = false;
            reqData.isInvestorActive = true;
          }
        }

        if (validData.type === "reedem") {
          reqData = {
            "payoutReedem.$.isPaid": true,
            "payoutReedem.$.transactionNumber": validData.transactionNumber,
            "payoutReedem.$.paidBy": new mongoose.Types.ObjectId(req.user._id),
            "payoutReedem.$.paidOn": new Date(),
            updatedBy: new mongoose.Types.ObjectId(req.user._id),
          };

          if (findInvestor.investmentAmount === 0) {
            reqData.isInvestorActive = false;
            reqData.isFullyPaid = true;
            reqData.transactionNumber = validData.transactionNumber;
            reqData.paidOn = new Date();
          }
        }

        if (validData.type === "matured") {
          reqData = {
            isInvestorActive: false,
            isFullyPaid: true,
            transactionNumber: validData.transactionNumber,
            paidOn: new Date(),
            updatedBy: new mongoose.Types.ObjectId(req.user._id),
          };
        }
        await finance.updateOne(
          validData.type === "payout"
            ? {
                "payoutSchedule._id": new mongoose.Types.ObjectId(
                  validData.payoutId
                ),
              }
            : validData.type === "reedem"
            ? {
                "payoutReedem._id": new mongoose.Types.ObjectId(
                  validData.reedemId
                ),
              }
            : { _id: new mongoose.Types.ObjectId(validData._id) },
          {
            $set: reqData,
          }
        );
        return res
          .status(StatusCodes.OK)
          .json({ message: "Payment updated successfully" });
      } else {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Investor not found!" });
      }
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const financeReedemApply = async (req, res) => {
  try {
    const validData = await reedemApplySchema.validate(req.body);
    if (validData) {
      const findInvestor = await finance.findOne({
        _id: new mongoose.Types.ObjectId(validData._id),
      });

      if (findInvestor) {
        const filterPayoutSchedule = findInvestor.payoutSchedule.filter(
          (item) => item.isPaid === true
        );
        const payoutSchedule =
          validData.remainingInvestAmount === "0"
            ? []
            : GeneratePayout({
                investmentAmount: validData.remainingInvestAmount,
                duration: validData.duration,
                interestRate: validData.interestRate,
                payoutFrequency:
                  validData.payoutFrequency === PayoutFrequencies.MONTHLY
                    ? 1
                    : validData.payoutFrequency === PayoutFrequencies.QUARTERLY
                    ? 3
                    : validData.payoutFrequency ===
                      PayoutFrequencies.SEMI_ANNUALLY
                    ? 6
                    : validData.payoutFrequency === PayoutFrequencies.ANNUALLY
                    ? 12
                    : validData.payoutFrequency ===
                      PayoutFrequencies.AT_MATURITY
                    ? Number(validData.duration)
                    : 1,
                payoutDate: validData.payoutDate,
              });
        await finance.updateOne(
          { _id: new mongoose.Types.ObjectId(validData._id) },
          {
            $push: {
              payoutReedem: {
                _id: new mongoose.Types.ObjectId(),
                reedemAmount: validData.reedemAmount,
                reedemDate: new Date(validData.reedemDate),
                remainingInvestAmount: validData.remainingInvestAmount,
                isPaid: false,
                paidOn: null,
                transactionNumber: null,
                createdBy: new mongoose.Types.ObjectId(req.user._id),
                createdOn: new Date(),
              },
            },
            $set: {
              investmentAmount: validData.remainingInvestAmount,
              duration:
                Number(validData.remainingInvestAmount) === 0
                  ? null
                  : validData.duration,
              interestRate:
                Number(validData.remainingInvestAmount) === 0
                  ? null
                  : validData.interestRate,
              payoutFrequency:
                Number(validData.remainingInvestAmount) === 0
                  ? null
                  : validData.payoutFrequency,
              payoutDate:
                Number(validData.remainingInvestAmount) === 0
                  ? null
                  : new Date(validData.payoutDate),

              updatedBy: new mongoose.Types.ObjectId(req.user._id),
              payoutSchedule: [...filterPayoutSchedule, ...payoutSchedule],
            },
          }
        );

        return res
          .status(StatusCodes.OK)
          .json({ message: "Reedem apply successfully" });
      } else {
        res
          .status(StatusCodes.NON_AUTHORITATIVE_INFORMATION)
          .json({ message: "Investor not found!" });
      }
    }
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

export const ReedemDatable = async (req, res) => {
  try {
    const reqData = req.body;
    const page = reqData.page;
    const limit = reqData.limit;
    const start = page * limit - limit;
    const query = [
      { "payoutReedem.isPaid": false },
      {
        "payoutReedem.reedemDate": {
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
          path: "$payoutReedem",
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

export const MaturedDatatable = async (req, res) => {
  try {
    const reqData = req.body;
    const page = reqData.page;
    const limit = reqData.limit;
    const start = page * limit - limit;
    const query = [
      { isMaturityCompleted: true },
      {
        isFullyPaid: false,
      },
    ];

    if (reqData.name) {
      query.push(BuildRegexQuery("name", reqData.name));
    }

    const countData = await finance.aggregate([
      { $match: query.length > 0 ? { $and: query } : {} },
      {
        $count: "count",
      },
    ]);

    const data = await finance.aggregate([
      { $match: query.length > 0 ? { $and: query } : {} },
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
