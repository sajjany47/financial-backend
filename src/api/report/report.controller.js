import { StatusCodes } from "http-status-codes";
import finance from "../Finance/finance.model.js";
import Loan from "../loan/loan.model.js";

export const financialReport = async (req, res) => {
  try {
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);

    const result = await finance.aggregate([
      {
        $facet: {
          totalInvestor: [{ $count: "total" }],
          newInvestor: [
            { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
            { $count: "total" },
          ],
          totalActiveInvestor: [
            { $match: { isInvestorActive: true } },
            { $count: "total" },
          ],
          totalInvestment: [
            {
              $group: {
                _id: null,
                totalInvestment: { $sum: "$initialCapital" },
              },
            },
          ],
          newInvestment: [
            {
              $match: { createdAt: { $gte: startDate, $lte: endDate } },
            },
            {
              $group: {
                _id: null,
                newInvestment: { $sum: "$initialCapital" },
              },
            },
          ],
          reedemAmount: [
            {
              $unwind: {
                path: "$payoutReedem",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $match: {
                "payoutReedem.isPaid": true,
                "payoutReedem.createdOn": { $gte: startDate, $lte: endDate },
              },
            },
            {
              $group: {
                _id: null,
                reedemAmount: { $sum: "$payoutReedem.reedemAmount" },
              },
            },
          ],
          remainingInvestAmount: [
            { $match: { isInvestorActive: true } },
            {
              $group: {
                _id: null,
                remainingInvestAmount: { $sum: "$investmentAmount" },
              },
            },
          ],
          monthWiseInvestor: [
            {
              $match: { createdAt: { $gte: startDate, $lte: endDate } },
            },
            {
              $project: {
                monthYear: {
                  $concat: [
                    {
                      $dateToString: {
                        format: "%B",
                        date: "$createdAt",
                      },
                    },
                    ",",
                    { $toString: { $year: "$createdAt" } },
                  ],
                },
                investAmount: "$initialCapital",
                investor: "$_id",
              },
            },
            {
              $group: {
                _id: "$monthYear",
                totalInvestAmount: { $sum: "$investAmount" },
                totalInvestors: { $addToSet: "$investor" },
              },
            },
            {
              $project: {
                _id: 1,
                totalInvestAmount: 1,
                totalInvestorCount: { $size: "$totalInvestors" },
              },
            },
            {
              $sort: {
                _id: 1,
              },
            },
          ],

          monthWiseReedem: [
            {
              $unwind: {
                path: "$payoutReedem",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $match: {
                "payoutReedem.isPaid": true,
                "payoutReedem.createdOn": { $gte: startDate, $lte: endDate },
                "payoutReedem.isPaid": true,
              },
            },
            {
              $project: {
                monthYear: {
                  $concat: [
                    {
                      $dateToString: {
                        format: "%B",
                        date: "$payoutReedem.reedemDate",
                      },
                    },
                    ", ",
                    {
                      $toString: {
                        $year: "$payoutReedem.reedemDate",
                      },
                    },
                  ],
                },
                reedemAmount: "$payoutReedem.reedemAmount",
              },
            },
            {
              $group: {
                _id: "$monthYear",
                totalReedemAmount: { $sum: "$reedemAmount" },
              },
            },
            {
              $sort: {
                _id: 1,
              },
            },
          ],
        },
      },
    ]);

    const data = result[0];

    res.status(StatusCodes.OK).json({
      message: "Data fetched successfully",
      data: {
        investor: {
          totalInvestor: data.totalInvestor[0]?.total || 0,
          newInvestor: data.newInvestor[0]?.total || 0,
          totalActiveInvestor: data.totalActiveInvestor[0]?.total || 0,
        },

        investment: {
          totalInvestment: data.totalInvestment[0]?.totalInvestment || 0,
          newInvestment: data.newInvestment[0]?.newInvestment || 0,
          reedemAmount: data.reedemAmount[0]?.reedemAmount || 0,
          remainingInvestAmount:
            data.remainingInvestAmount[0]?.remainingInvestAmount || 0,
        },

        monthWiseInvestor: data.monthWiseInvestor || [],
        monthWiseReedem: data.monthWiseReedem || [],
      },
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const loanPerformance = async (req, res) => {
  try {
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);

    const commonQuery = [
      {
        $project: {
          monthYear: {
            $concat: [
              {
                $dateToString: {
                  format: "%B",
                  date: "$createdAt",
                },
              },
              ",",
              { $toString: { $year: "$createdAt" } },
            ],
          },
          loan: "$_id",
        },
      },
      {
        $group: {
          _id: "$monthYear",
          totalLoan: {
            $addToSet: "$loan",
          },
        },
      },
      {
        $project: {
          _id: 1,
          total: { $size: "$totalLoan" },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ];

    const result = await Loan.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      {
        $facet: {
          lead: [
            {
              $match: {
                applicationStaus: "lead",
              },
            },
            { $count: "total" },
          ],
          approvedLoan: [
            {
              $match: {
                applicationStaus: "disbursed",
              },
            },
            { $count: "total" },
          ],
          incompletedLoan: [
            {
              $match: {
                applicationStaus: "incompleted",
              },
            },
            { $count: "total" },
          ],
          rejectLoan: [
            {
              $match: {
                applicationStaus: "rejected",
              },
            },
            { $count: "total" },
          ],

          totalEmi: [
            {
              $match: {
                applicationStaus: "disbursed",
              },
            },
            {
              $unwind: {
                path: "$emiSchedule",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $match: {
                "emiSchedule.emiDate": {
                  $gte: startDate,
                  $lte: endDate,
                },
              },
            },
            { $count: "total" },
          ],
          paidEmi: [
            {
              $match: {
                applicationStaus: "disbursed",
              },
            },
            {
              $unwind: {
                path: "$emiSchedule",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $match: {
                "emiSchedule.emiDate": {
                  $gte: startDate,
                  $lte: endDate,
                },
                "emiSchedule.isPaid": true,
              },
            },
            { $count: "total" },
          ],
          unpaidEmi: [
            {
              $match: {
                applicationStaus: "disbursed",
              },
            },
            {
              $unwind: {
                path: "$emiSchedule",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $match: {
                "emiSchedule.emiDate": {
                  $gte: startDate,
                  $lte: endDate,
                },
                "emiSchedule.isPaid": false,
              },
            },
            { $count: "total" },
          ],
          defaultEmi: [
            {
              $match: {
                applicationStaus: "disbursed",
              },
            },
            {
              $unwind: {
                path: "$emiSchedule",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $match: {
                "emiSchedule.emiDate": {
                  $gte: startDate,
                  $lte: endDate,
                },
                "emiSchedule.isPaid": false,
                "emiSchedule.emiDate": { $lt: new Date() },
              },
            },
            { $count: "total" },
          ],
          monthWiseLoan: [
            {
              $match: {
                applicationStaus: "disbursed",
              },
            },
            ...commonQuery,
          ],
          monthWiseLead: [
            {
              $match: {
                applicationStaus: "lead",
              },
            },
            ...commonQuery,
          ],
        },
      },
    ]);

    const data = result[0];

    res.status(StatusCodes.OK).json({
      message: "Data fetched successfully",
      data: {
        loan: {
          lead: data.lead[0]?.total || 0,
          approvedLoan: data.approvedLoan[0]?.total || 0,
          incompletedLoan: data.incompletedLoan[0]?.total || 0,
          rejectLoan: data.rejectLoan[0]?.total || 0,
        },

        emi: {
          totalEmi: data.totalEmi[0]?.total || 0,
          paidEmi: data.paidEmi[0]?.total || 0,
          unpaidEmi: data.unpaidEmi[0]?.total || 0,
          defaultEmi: data.defaultEmi[0]?.total || 0,
        },

        monthWiseLoan: data.monthWiseLoan || [],
        monthWiseLead: data.monthWiseLead || [],
      },
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};
