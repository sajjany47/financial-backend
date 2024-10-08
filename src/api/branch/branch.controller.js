import { StatusCodes } from "http-status-codes";
import { createBranchSchema } from "./branch.schema.js";
import branch from "./branch.model.js";
import mongoose from "mongoose";
import { BuildRegexQuery } from "../../utilis/utilis.js";

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
          country: Number(validateData.country),
          state: Number(validateData.state),
          city: Number(validateData.city),
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
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const updateBranch = async (req, res) => {
  try {
    const validateData = await createBranchSchema.validate(req.body);
    if (validateData) {
      const checkValidBranch = await branch.findOne({
        _id: new mongoose.Types.ObjectId(validateData._id),
      });
      if (checkValidBranch) {
        const branchData = {
          country: Number(validateData.country),
          state: Number(validateData.state),
          city: Number(validateData.city),
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
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
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
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const dataTable = async (req, res) => {
  try {
    // // Function to generate random data for 20 branches
    // const generateBranchData = (index) => {
    //   return {
    //     name: `Kalighat${index}`,
    //     country: 101,
    //     state: 4853,
    //     city: 142001,
    //     email: `kalighat${index}@gmail.com`,
    //     phone: `033123456${index.toString().padStart(2, "0")}`,
    //     address: `kalighat, kolkata${index}`,
    //     pincode: `7000${(26 + index).toString().padStart(2, "0")}`,
    //     code: `KLG${(26 + index).toString().padStart(5, "0")}`,
    //     isActive: true,
    //     createdBy: "sajjany47",
    //     updatedBy: "sajjany47",
    //     createdAt: new Date("2024-08-16T05:43:58.601Z"),
    //     updatedAt: new Date("2024-09-12T11:40:06.049Z"),
    //   };
    // };

    // // Function to create an array of 20 branch objects
    // const createBranchArray = () => {
    //   const branches = [];
    //   for (let i = 0; i < 100; i++) {
    //     branches.push(generateBranchData(i));
    //   }
    //   return branches;
    // };

    // // Generate the array of branch data
    // const branchArray = createBranchArray();
    // await branch.insertMany(branchArray);

    const reqData = req.body;
    const page = reqData.page;
    const limit = reqData.limit;
    const start = page * limit - limit;
    const query = [];
    if (reqData.name) {
      query.push(BuildRegexQuery("name", reqData.name));
    }
    if (reqData.country) {
      query.push({ country: reqData.country });
    }
    if (reqData.hasOwnProperty("state")) {
      query.push({ state: reqData.state });
    }
    if (reqData.hasOwnProperty("city")) {
      query.push({ city: reqData.city });
    }
    if (reqData.pincode) {
      query.push(BuildRegexQuery("pincode", reqData.pincode));
    }
    if (reqData.code) {
      query.push(BuildRegexQuery("code", reqData.code));
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
        $lookup: {
          from: "countries",
          localField: "country",
          foreignField: "id",
          as: "countryDetails",
        },
      },
      {
        $unwind: {
          path: "$countryDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "states",
          localField: "state",
          foreignField: "id",
          as: "stateDetails",
        },
      },
      {
        $unwind: {
          path: "$stateDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "cities",
          localField: "city",
          foreignField: "id",
          as: "cityDetails",
        },
      },
      {
        $unwind: {
          path: "$cityDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          countryName: "$countryDetails.name",
          country: 1,
          stateName: "$stateDetails.name",
          state: 1,
          cityName: "$cityDetails.name",
          city: 1,
          email: 1,
          phone: 1,
          pincode: 1,
          address: 1,
          code: 1,
          isActive: 1,
          name: 1,
        },
      },
      {
        $sort: reqData.sort || { name: 1 },
      },
      { $skip: start },
      { $limit: limit },
    ]);

    return res.status(StatusCodes.OK).json({
      message: "Data fetched successfully",
      data: data,
      count: countData,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};
