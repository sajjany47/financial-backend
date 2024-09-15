import { StatusCodes } from "http-status-codes";
import { LeadSchema } from "./loan.schema.js";
import Loan from "./loan.model.js";
import mongoose from "mongoose";

export const LeadGenerate = async (req, res) => {
  try {
    const validateData = await LeadSchema.validate(req.body);
    if (validateData) {
      const LeadCreate = new Loan({
        name: validateData.name,
        mobile: validateData.mobile,
        email: validateData.email,
        dob: new Date(validateData.dob),
        loanType: validateData.loanType,
        loanAmount: validateData.loanAmount,
        loanTenure: validateData.loanTenure,
        branch: new mongoose.Types.ObjectId(req.user.branch),
      });

      await LeadCreate.save();

      res.status(StatusCodes.OK).json({ message: "Lead created successfully" });
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const NewApplication = async (req, res) => {
  try {
    const validateData = await LeadSchema.validate(req.body);
    if (validateData) {
      const LeadCreate = new Loan({
        name: validateData.name,
        mobile: validateData.mobile,
        email: validateData.email,
        dob: new Date(validateData.dob),
        loanType: validateData.loanType,
        loanAmount: validateData.loanAmount,
        loanTenure: validateData.loanTenure,
        branch: new mongoose.Types.ObjectId(req.user.branch),
      });

      await LeadCreate.save();

      res.status(StatusCodes.OK).json({ message: "Lead created successfully" });
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};
