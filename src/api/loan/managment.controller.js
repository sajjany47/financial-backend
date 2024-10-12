import { StatusCodes } from "http-status-codes";
import { Position } from "../employess/EmployeeConfig";

export const LoanManagList = async (req, res) => {
  try {
    const position = req.user.position;
    const query = [
      { country: position === Position.ADMIN ? {} : req.user.country },
      {
        state:
          position === Position.ADMIN
            ? {}
            : position === Position.SM
            ? req.user.state
            : {},
      },
    ];
    if (req.user.position === Position.ADMIN) {
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};
