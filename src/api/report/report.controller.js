import { StatusCodes } from "http-status-codes";
import finance from "../Finance/finance.model";

export const financialReport = async (req, res) => {
  try {
    const totalInvestor = await finance.aggregate([{ $count: "total" }]);
    const newInvestor = await finance.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(req.body.startDate),
            $lte: new Date(req.body.endDate),
          },
        },
      },
      { $count: "total" },
    ]);
    const totalActiveInvestor = await finance.aggregate([
      { $match: { isInvestorActive: true } },
      { $count: "total" },
    ]);

    res.status(StatusCodes.OK).json({
      message: "Data fetched successfully",
      data: {
        investor: {
          totalInvestor: totalInvestor[0].total,
          newInvestor: newInvestor[0].total,
          totalActiveInvestor: totalActiveInvestor[0].total,
        },
      },
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};
