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
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};
