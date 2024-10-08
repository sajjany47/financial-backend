import { StatusCodes } from "http-status-codes";
import { createBranchSchema } from "./branch.schema.js";
import branch from "./branch.model.js";
import mongoose from "mongoose";
import { query } from "express";
import { cityList, countryList, stateList } from "../../utilis/utilis.js";

export const createBranch = async (req, res) => {
  try {
    const validateData = await createBranchSchema.validate(req.body);
    if (validateData) {
      const checkNameAndCode = await branch.findOne({
        name: validateData.name,
        code: validateData.code,
      });
      if (!checkNameAndCode) {
        const branchData = new branch({
          name: validateData.name,
          country: validateData.country,
          state: validateData.state,
          city: validateData.city,
          email: validateData.email,
          phone: validateData.phone,
          address: validateData.address,
          pincode: validateData.pincode,
          code: validateData.code,
          isActive: true,
          createdBy: req.user.username,
          updatedBy: null,
        });

        const branchCreate = await branchData.save();

        return res
          .status(StatusCodes.OK)
          .json({ message: "Branch created successfully", data: branchCreate });
      }
    }
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error });
  }
};

export const updateBranch = async (req, res) => {
  try {
    const validateData = req.body;
    if (validateData) {
      const checkValidBranch = await branch.findOne({
        _id: new mongoose.Types.ObjectId(validateData._id),
      });
      if (checkValidBranch) {
        const branchData = {
          country: validateData.country,
          state: validateData.state,
          city: validateData.city,
          email: validateData.email,
          phone: validateData.phone,
          address: validateData.address,
          pincode: validateData.pincode,
          isActive: validateData.isActive,
          updatedBy: req.user.username,
        };

        const branchUpdate = await branch.updateOne(
          { _id: new mongoose.Types.ObjectId(validateData._id) },
          { $set: branchData }
        );

        return res
          .status(StatusCodes.OK)
          .json({ message: "Branch updated successfully", data: branchUpdate });
      }
    }
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error });
  }
};

export const branchList = async (req, res) => {
  try {
    const reqData = req.query;

    const data = await branch.aggregate([
      { $match: Object.keys(reqData).length > 0 ? reqData : {} },
    ]);

    res
      .status(StatusCodes.OK)
      .json({ message: "Data fetched successfully", data: data });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error });
  }
};

export const dataTable = async (req, res) => {
  try {
    const reqData = req.body;
    const page = reqData.page;
    const limit = reqData.limit;
    const start = page * limit - limit;

    const query = [];
    if (reqData.hasOwnProperty("name")) {
      query.push({ name: { $regex: `^${reqData.name}`, $options: "i" } });
    }
    if (reqData.hasOwnProperty("country")) {
      query.push({ country: { $regex: `^${reqData.country}`, $options: "i" } });
    }
    if (reqData.hasOwnProperty("state")) {
      query.push({ state: { $regex: `^${reqData.state}`, $options: "i" } });
    }
    if (reqData.hasOwnProperty("city")) {
      query.push({ city: { $regex: `^${reqData.city}`, $options: "i" } });
    }
    if (reqData.hasOwnProperty("pincode")) {
      query.push({ pincode: { $regex: `^${reqData.pincode}`, $options: "i" } });
    }
    if (reqData.hasOwnProperty("code")) {
      query.push({ code: { $regex: `^${reqData.code}`, $options: "i" } });
    }
    if (reqData.hasOwnProperty("isActive")) {
      query.push({ isActive: reqData.isActive });
    }

    const countData = await branch.countDocuments([
      { $match: query.length > 0 ? { $and: query } : {} },
    ]);

    const data = await branch.aggregate([
      { $match: query.length > 0 ? { $and: query } : {} },
      {
        $sort: reqData.hasOwnProperty("sort")
          ? reqData.sort
          : {
              name: 1,
            },
      },
      { $skip: start },
      { $limit: limit },
    ]);

    let finalData = [];

    for (const value of data) {
      const response = {};
      const countryData = await countryList();

      if (countryList) {
        const filterCountry = countryData.find(
          (item) => item.id === Number(value.country)
        );

        if (filterCountry) {
          response.country = filterCountry.name;
          const stateData = await stateList(filterCountry.iso2);

          const filterState = stateData.find(
            (stateItem) => stateItem.id === Number(value.state)
          );

          if (filterState) {
            response.state = filterState.name;
            const cityData = await cityList(
              filterCountry.iso2,
              filterState.iso2
            );
            const filterCity = cityData.find(
              (cityItem) => cityItem.id === Number(value.city)
            );
            if (filterCity) {
              response.city = filterCity.name;
            }
          }
          await finalData.push({ ...value, ...response });
        }
      }
    }

    return res.status(StatusCodes.OK).json({
      message: "Data fetched successfully",
      data: finalData,
      count: countData,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error });
  }
};
