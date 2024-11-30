import { StatusCodes } from "http-status-codes";
import { PositionSchema } from "./accessControl.schema.js";
import position from "./position.model.js";
import mongoose from "mongoose";

export const PositionCreate = async (req, res) => {
  try {
    const validateData = await PositionSchema.validate(req.body);
    if (validateData) {
      const checkData = await position.findOne({
        name: validateData.name,
      });
      if (checkData) {
        return res
          .status(StatusCodes.CONFLICT)
          .json({ message: "Position already present" });
      } else {
        let data = new position({
          _id: new mongoose.Types.ObjectId(),
          name: validateData.name,
          createdBy: new mongoose.Types.ObjectId(req.user._id),
          menu: validateData.menu.map(
            (item) => new mongoose.Types.ObjectId(item)
          ),
        });

        await data.save();

        return res.status(StatusCodes.OK).json({
          message: "Position created successfully",
        });
      }
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const PositionUpdate = async (req, res) => {
  try {
    const validateData = await PositionSchema.validate(req.body);
    if (validateData) {
      const checkData = await position.findOne({
        _id: new mongoose.Types.ObjectId(validateData._id),
      });
      if (!checkData) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Position not found!" });
      } else {
        let reqData = {
          menu: validateData.menu.map(
            (item) => new mongoose.Types.ObjectId(item)
          ),
          name: validateData.name,
          isActive: validateData.isActive ? validateData.isActive : true,
          updatedBy: new mongoose.Types.ObjectId(req.user._id),
        };

        if (checkData.name !== validateData.name) {
          const checkName = await position.findOne({
            name: validateData.name,
          });
          if (checkName) {
            return res
              .status(StatusCodes.CONFLICT)
              .json({ message: "Position already present" });
          } else {
            reqData.name = validateData.name;
          }
        } else {
          reqData.name = validateData.name;
        }

        await position.updateOne(
          { _id: new mongoose.Types.ObjectId(validateData._id) },
          { $set: reqData }
        );

        return res.status(StatusCodes.OK).json({
          message: "Position updated successfully",
        });
      }
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const PositionList = async (req, res) => {
  try {
    const result = await position.find({});
    res
      .status(StatusCodes.OK)
      .json({ message: "Data fetched successfully", data: result });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};
