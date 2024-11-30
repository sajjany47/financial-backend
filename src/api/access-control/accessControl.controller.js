import { StatusCodes } from "http-status-codes";
import { childMenuSchema, primaryMenuSchema } from "./accessControl.schema.js";
import accessControl from "./accessControl.model.js";
import mongoose from "mongoose";
import { DataWithEmployeeName } from "../loan/loan.config.js";

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
        const filterData = checkData.childMenu.filter(
          (item) =>
            item.name === validateData.name || item.path === validateData.path
        );
        if (filterData.length > 0) {
          return res
            .status(StatusCodes.CONFLICT)
            .json({ message: "Child menu already present" });
        } else {
          let data = {
            _id: new mongoose.Types.ObjectId(),
            name: validateData.name,
            path: validateData.path,
            isActive: validateData.isActive ? validateData.isActive : true,
            createdBy: new mongoose.Types.ObjectId(req.user._id),
          };

          await accessControl.updateOne(
            { _id: new mongoose.Types.ObjectId(validateData.primaryMenu) },
            { $push: { childMenu: data }, $set: { updatedBy: req.user._id } }
          );

          return res.status(StatusCodes.OK).json({
            message: "Menu updated successfully",
          });
        }
      }
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const ChildMenuUpdate = async (req, res) => {
  try {
    let error = false;
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
          name: validateData.name,
          path: validateData.path,
          isActive: validateData.isActive ? validateData.isActive : true,
          updatedBy: new mongoose.Types.ObjectId(req.user._id),
        };

        const modifyData = checkData.childMenu.map((item) => {
          let data = item;
          if (item._id.toString() === validateData._id.toString()) {
            if (item.name !== validateData.name) {
              const checkFilterName = checkData.childMenu.filter(
                (elm) => elm.name === item.name || elm.path === item.path
              );
              if (checkFilterName.length > 0) {
                error = true;
              } else {
                error = false;
                data = {
                  ...reqData,
                  _id: new mongoose.Types.ObjectId(validateData._id),
                };
              }
            }
            error = false;
            data = {
              ...reqData,
              _id: new mongoose.Types.ObjectId(validateData._id),
            };
          }

          return data;
        });

        if (error) {
          return res
            .status(StatusCodes.CONFLICT)
            .json({ message: "Child Menu name or path already present" });
        } else {
          await accessControl.updateOne(
            { _id: new mongoose.Types.ObjectId(validateData._id) },
            { $set: { childMenu: modifyData, updatedBy: req.user._id } }
          );

          return res.status(StatusCodes.OK).json({
            message: "Menu updated successfully",
          });
        }
      }
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const MenuList = async (req, res) => {
  try {
    const result = await accessControl.aggregate([{ $match: {} }]);
    const modifyData = await Promise.all(
      result.map(async (item) => ({
        ...item,
        createdBy: await DataWithEmployeeName(item.createdBy),
        updatedBy: item.updatedBy
          ? await DataWithEmployeeName(item.updatedBy)
          : null,
      }))
    );
    res
      .status(StatusCodes.OK)
      .json({ message: "Data fetched successfully", data: modifyData });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const ChildMenuList = async (req, res) => {
  try {
    const result = await accessControl.aggregate([
      {
        $unwind: {
          path: "$childMenu",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    const modifyData = await Promise.all(
      result.map(async (item) => ({
        ...item,
        childMenu: {
          ...item?.childMenu,
          createdBy: item?.childMenu.createdBy
            ? await DataWithEmployeeName(item.childMenu.createdBy)
            : "",
        },
        createdBy: item.createdBy
          ? await DataWithEmployeeName(item.createdBy)
          : "",
        updatedBy: item.updatedBy
          ? await DataWithEmployeeName(item.updatedBy)
          : null,
      }))
    );
    res
      .status(StatusCodes.OK)
      .json({ message: "Data fetched successfully", data: result });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};
