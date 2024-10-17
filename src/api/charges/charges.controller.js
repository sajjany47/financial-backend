import { StatusCodes } from "http-status-codes";
import { chargesSchema } from "./charges.schema.js";
import charges from "./charges.model.js";
import mongoose from "mongoose";

export const createCharges = async (req, res) => {
  try {
    const validateData = await chargesSchema.validate(req.body);
    if (validateData) {
      const checkPreviousActive = await charges.findOne({ isActive: true });
      if (checkPreviousActive) {
        return res
          .status(StatusCodes.CONFLICT)
          .json({ message: "Previous active charge required to inactive" });
      } else {
        const data = new charges({
          processingFees: Number(validateData.processingFees),
          processingFeesGST: Number(validateData.processingFeesGST),
          loginFees: Number(validateData.loginFees),
          loginFeesGST: Number(validateData.loginFeesGST),
          otherCharges: Number(validateData.otherCharges),
          otherChargesGST: Number(validateData.otherChargesGST),
          foreclosureFees: Number(validateData.foreclosureFees),
          foreclosureFeesGST: Number(validateData.foreclosureFeesGST),
          foreclosureApply: Number(validateData.foreclosureApply),
          overdue: Number(validateData.overdue),
          isActive: true,
          createdBy: req.user._id,
        });
        await data.save();

        return res
          .status(StatusCodes.OK)
          .json({ message: "Charges created successfully" });
      }
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const statusChanges = async (req, res) => {
  try {
    let reqData = req.body.status;
    if (reqData) {
      const checkPreviousActive = await charges.findOne({ isActive: true });
      if (checkPreviousActive) {
        return res
          .status(StatusCodes.CONFLICT)
          .json({ message: "Make sure previous active charges are inactive" });
      } else {
        reqData = true;
      }
    } else {
      reqData = false;
    }

    await charges.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(req.body._id),
      },
      { $set: { isActive: reqData, updatedBy: req.user._id } }
    );
    return res
      .status(StatusCodes.OK)
      .json({ message: "Status updated successfully" });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const chargesList = async (req, res) => {
  try {
    const list = await charges.find({}).sort({ isActive: -1 });

    res
      .status(StatusCodes.OK)
      .json({ message: "Data fetched successfully", data: list });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const getCharges = async (req, res) => {
  try {
    const data = await charges.findOne({ isActive: true });

    res
      .status(StatusCodes.OK)
      .json({ message: "Data fetched successfully", data: data });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};
