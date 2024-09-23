import { StatusCodes } from "http-status-codes";
import documentType from "./documentType.model.js";
import mongoose from "mongoose";

export const typeCreate = async (req, res) => {
  try {
    const validateData = req.body;
    if (validateData) {
      const data = new documentType({
        name: validateData.name,
        description: validateData.description,
        isActive: true,
        createdBy: req.user.username,
      });

      await data.save();

      return res
        .status(StatusCodes.OK)
        .json({ message: "Document type created successfully" });
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error });
  }
};

export const typeUpdate = async (req, res) => {
  try {
    const validateData = req.body;
    if (validateData) {
      const updateData = await documentType.updateOne(
        {
          _id: new mongoose.Types.ObjectId(validateData._id),
        },
        {
          $set: {
            name: validateData.name,
            description: validateData.description,
            updatedBy: req.user.username,
            isActive: validateData.isActive,
          },
        }
      );

      return res
        .status(StatusCodes.OK)
        .json({ message: "Document type updated successfully" });
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error });
  }
};
