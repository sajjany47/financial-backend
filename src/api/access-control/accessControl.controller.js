import { StatusCodes } from "http-status-codes";
import { childMenuSchema, primaryMenuSchema } from "./accessControl.schema";
import accessControl from "./accessControl.model";
import mongoose from "mongoose";

export const PrimaryMenuCreate = async (req, res) => {
  try {
    const validateData = await primaryMenuSchema.validate(req.body);
    if (validateData) {
      const checkDuplicateData = await accessControl.findOne({
        name: validateData.name,
      });
      if (checkDuplicateData) {
        return res
          .status(StatusCodes.CONFLICT)
          .json({ message: "Primary menu name already present" });
      } else {
        const data = new accessControl({
          name: validateData.name,
          isActive: true,
          icon: validateData.icon ? validateData.icon : null,
          createdBy: req.user._id,
          childMenu: [],
        });

        await data.save();

        return res.status(StatusCodes.OK).json({
          message: "Menu created successfully",
        });
      }
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const PrimaryMenuUpdate = async (req, res) => {
  try {
    const validateData = await primaryMenuSchema.validate(req.body);
    if (validateData) {
      const checkData = await accessControl.findOne({
        _id: new mongoose.Types.ObjectId(validateData._id),
      });
      if (!checkData) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Primary menu not found!" });
      } else {
        let data = {
          isActive: validateData.isActive ? validateData.isActive : true,
          updatedBy: req.user._id,
          icon: validateData.icon ? validateData.icon : null,
        };

        if (checkData.name !== validateData.name) {
          const checkDuplicateData = await accessControl.findOne({
            name: validateData.name,
          });

          if (checkDuplicateData) {
            return res
              .status(StatusCodes.CONFLICT)
              .json({ message: "Primary menu name already present" });
          } else {
            data.name = validateData.name;
          }
        }

        await accessControl.updateOne(
          { _id: new mongoose.Types.ObjectId(validateData._id) },
          { $set: data }
        );

        return res.status(StatusCodes.OK).json({
          message: "Menu updated successfully",
        });
      }
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const ChildMenuCreate = async (req, res) => {
  try {
    const validateData = await childMenuSchema.validate(req.body);
    if (validateData) {
      const checkData = await accessControl.findOne({
        _id: new mongoose.Types.ObjectId(validateData.primaryMenu),
      });
      if (!checkData) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Primary menu not found!" });
      } else {
        let data = {
          _id: new mongoose.Types.ObjectId(),
          name: validateData.name,
          path: validateData.path,
          isActive: validateData.isActive ? validateData.isActive : true,
          createdBy: new mongoose.Types.ObjectId(req.user._id),
        };

        await accessControl.updateOne(
          { _id: new mongoose.Types.ObjectId(validateData._id) },
          { $push: { childMenu: data }, $set: { updatedBy: req.user._id } }
        );

        return res.status(StatusCodes.OK).json({
          message: "Menu updated successfully",
        });
      }
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const ChildMenuUpdate = async (req, res) => {
  try {
    const validateData = await childMenuSchema.validate(req.body);
    if (validateData) {
      const checkData = await accessControl.findOne({
        _id: new mongoose.Types.ObjectId(validateData.primaryMenu),
      });
      if (!checkData) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Primary menu not found!" });
      } else {
        const reqData = {
          _id: new mongoose.Types.ObjectId(),
          name: validateData.name,
          path: validateData.path,
          isActive: validateData.isActive ? validateData.isActive : true,
          updatedBy: new mongoose.Types.ObjectId(req.user._id),
        };

        const modifyData = checkData.childMenu.map((item) => {
          let data = item;
          if (item._id.toString() === validateData._id.toString()) {
            data = reqData;
          }

          return data;
        });

        await accessControl.updateOne(
          { _id: new mongoose.Types.ObjectId(validateData._id) },
          { $set: { childMenu: modifyData, updatedBy: req.user._id } }
        );

        return res.status(StatusCodes.OK).json({
          message: "Menu updated successfully",
        });
      }
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};
