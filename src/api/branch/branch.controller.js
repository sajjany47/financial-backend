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
          countryName: validateData.countryName,
          stateName: validateData.stateName,
          cityName: validateData.cityName,
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
          countryName: validateData.countryName,
          stateName: validateData.stateName,
          cityName: validateData.cityName,
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
    // const a = [
    //   {
    //     name: "Esplanade",
    //     country: 101,
    //     state: 4853,
    //     city: 142001,
    //     email: "esplanade@gmail.com",
    //     phone: "03312345679",
    //     address: "esplanade, kolkata",
    //     pincode: "700001",
    //     code: "ESL00001",
    //     countryName: "India",
    //     stateName: "West Bengal",
    //     cityName: "Kolkata",
    //     isActive: true,
    //     createdBy: "sajjany47",
    //     updatedBy: "sajjany47",
    //   },
    //   {
    //     name: "Park Street",
    //     country: 101,
    //     state: 4853,
    //     city: 142001,
    //     email: "parkstreet@gmail.com",
    //     phone: "03312345680",
    //     address: "park street, kolkata",
    //     pincode: "700016",
    //     code: "PKS00016",
    //     countryName: "India",
    //     stateName: "West Bengal",
    //     cityName: "Kolkata",
    //     isActive: true,
    //     createdBy: "sajjany47",
    //     updatedBy: "sajjany47",
    //   },
    //   {
    //     name: "Salt Lake",
    //     country: 101,
    //     state: 4853,
    //     city: 142001,
    //     email: "saltlake@gmail.com",
    //     phone: "03312345681",
    //     address: "salt lake, kolkata",
    //     pincode: "700091",
    //     code: "SLK00091",
    //     countryName: "India",
    //     stateName: "West Bengal",
    //     cityName: "Kolkata",
    //     isActive: true,
    //     createdBy: "sajjany47",
    //     updatedBy: "sajjany47",
    //   },
    //   {
    //     name: "Howrah",
    //     country: 101,
    //     state: 4853,
    //     city: 142001,
    //     email: "howrah@gmail.com",
    //     phone: "03312345682",
    //     address: "howrah, kolkata",
    //     pincode: "700023",
    //     code: "HWR00023",
    //     countryName: "India",
    //     stateName: "West Bengal",
    //     cityName: "Kolkata",
    //     isActive: true,
    //     createdBy: "sajjany47",
    //     updatedBy: "sajjany47",
    //   },
    //   {
    //     name: "Dum Dum",
    //     country: 101,
    //     state: 4853,
    //     city: 142001,
    //     email: "dumdum@gmail.com",
    //     phone: "03312345683",
    //     address: "dum dum, kolkata",
    //     pincode: "700028",
    //     code: "DUM00028",
    //     countryName: "India",
    //     stateName: "West Bengal",
    //     cityName: "Kolkata",
    //     isActive: true,
    //     createdBy: "sajjany47",
    //     updatedBy: "sajjany47",
    //   },
    //   {
    //     name: "New Town",
    //     country: 101,
    //     state: 4853,
    //     city: 142001,
    //     email: "newtown@gmail.com",
    //     phone: "03312345684",
    //     address: "new town, kolkata",
    //     pincode: "700156",
    //     code: "NTW00156",
    //     countryName: "India",
    //     stateName: "West Bengal",
    //     cityName: "Kolkata",
    //     isActive: true,
    //     createdBy: "sajjany47",
    //     updatedBy: "sajjany47",
    //   },
    //   {
    //     name: "Gariahat",
    //     country: 101,
    //     state: 4853,
    //     city: 142001,
    //     email: "gariahat@gmail.com",
    //     phone: "03312345685",
    //     address: "gariahat, kolkata",
    //     pincode: "700029",
    //     code: "GAT00029",
    //     countryName: "India",
    //     stateName: "West Bengal",
    //     cityName: "Kolkata",
    //     isActive: true,
    //     createdBy: "sajjany47",
    //     updatedBy: "sajjany47",
    //   },
    //   {
    //     name: "Shyambazar",
    //     country: 101,
    //     state: 4853,
    //     city: 142001,
    //     email: "shyambazar@gmail.com",
    //     phone: "03312345686",
    //     address: "shyambazar, kolkata",
    //     pincode: "700004",
    //     code: "SYB00004",
    //     countryName: "India",
    //     stateName: "West Bengal",
    //     cityName: "Kolkata",
    //     isActive: true,
    //     createdBy: "sajjany47",
    //     updatedBy: "sajjany47",
    //   },
    //   {
    //     name: "Tollygunge",
    //     country: 101,
    //     state: 4853,
    //     city: 142001,
    //     email: "tollygunge@gmail.com",
    //     phone: "03312345687",
    //     address: "tollygunge, kolkata",
    //     pincode: "700033",
    //     code: "TGY00033",
    //     countryName: "India",
    //     stateName: "West Bengal",
    //     cityName: "Kolkata",
    //     isActive: true,
    //     createdBy: "sajjany47",
    //     updatedBy: "sajjany47",
    //   },
    //   {
    //     name: "Ballygunge",
    //     country: 101,
    //     state: 4853,
    //     city: 142001,
    //     email: "ballygunge@gmail.com",
    //     phone: "03312345688",
    //     address: "ballygunge, kolkata",
    //     pincode: "700019",
    //     code: "BGU00019",
    //     countryName: "India",
    //     stateName: "West Bengal",
    //     cityName: "Kolkata",
    //     isActive: true,
    //     createdBy: "sajjany47",
    //     updatedBy: "sajjany47",
    //   },
    //   {
    //     name: "Jadavpur",
    //     country: 101,
    //     state: 4853,
    //     city: 142001,
    //     email: "jadavpur@gmail.com",
    //     phone: "03312345689",
    //     address: "jadavpur, kolkata",
    //     pincode: "700032",
    //     code: "JDV00032",
    //     countryName: "India",
    //     stateName: "West Bengal",
    //     cityName: "Kolkata",
    //     isActive: true,
    //     createdBy: "sajjany47",
    //     updatedBy: "sajjany47",
    //   },
    //   {
    //     name: "Behala",
    //     country: 101,
    //     state: 4853,
    //     city: 142001,
    //     email: "behala@gmail.com",
    //     phone: "03312345690",
    //     address: "behala, kolkata",
    //     pincode: "700034",
    //     code: "BHL00034",
    //     countryName: "India",
    //     stateName: "West Bengal",
    //     cityName: "Kolkata",
    //     isActive: true,
    //     createdBy: "sajjany47",
    //     updatedBy: "sajjany47",
    //   },
    //   {
    //     name: "Alipore",
    //     country: 101,
    //     state: 4853,
    //     city: 142001,
    //     email: "alipore@gmail.com",
    //     phone: "03312345691",
    //     address: "alipore, kolkata",
    //     pincode: "700027",
    //     code: "ALP00027",
    //     countryName: "India",
    //     stateName: "West Bengal",
    //     cityName: "Kolkata",
    //     isActive: true,
    //     createdBy: "sajjany47",
    //     updatedBy: "sajjany47",
    //   },
    //   {
    //     name: "Rabindra Sadan",
    //     country: 101,
    //     state: 4853,
    //     city: 142001,
    //     email: "rabindrasadan@gmail.com",
    //     phone: "03312345692",
    //     address: "rabindra sadan, kolkata",
    //     pincode: "700020",
    //     code: "RSD00020",
    //     countryName: "India",
    //     stateName: "West Bengal",
    //     cityName: "Kolkata",
    //     isActive: true,
    //     createdBy: "sajjany47",
    //     updatedBy: "sajjany47",
    //   },
    //   {
    //     name: "BBD Bagh",
    //     country: 101,
    //     state: 4853,
    //     city: 142001,
    //     email: "bbdbagh@gmail.com",
    //     phone: "03312345693",
    //     address: "bbd bagh, kolkata",
    //     pincode: "700001",
    //     code: "BBD00001",
    //     countryName: "India",
    //     stateName: "West Bengal",
    //     cityName: "Kolkata",
    //     isActive: true,
    //     createdBy: "sajjany47",
    //     updatedBy: "sajjany47",
    //   },
    //   {
    //     name: "Sealdah",
    //     country: 101,
    //     state: 4853,
    //     city: 142001,
    //     email: "sealdah@gmail.com",
    //     phone: "03312345694",
    //     address: "sealdah, kolkata",
    //     pincode: "700014",
    //     code: "SDL00014",
    //     countryName: "India",
    //     stateName: "West Bengal",
    //     cityName: "Kolkata",
    //     isActive: true,
    //     createdBy: "sajjany47",
    //     updatedBy: "sajjany47",
    //   },
    //   {
    //     name: "Kasba",
    //     country: 101,
    //     state: 4853,
    //     city: 142001,
    //     email: "kasba@gmail.com",
    //     phone: "03312345695",
    //     address: "kasba, kolkata",
    //     pincode: "700078",
    //     code: "KAS00078",
    //     countryName: "India",
    //     stateName: "West Bengal",
    //     cityName: "Kolkata",
    //     isActive: true,
    //     createdBy: "sajjany47",
    //     updatedBy: "sajjany47",
    //   },
    //   {
    //     name: "Chowringhee",
    //     country: 101,
    //     state: 4853,
    //     city: 142001,
    //     email: "chowringhee@gmail.com",
    //     phone: "03312345696",
    //     address: "chowringhee, kolkata",
    //     pincode: "700020",
    //     code: "CHW00020",
    //     countryName: "India",
    //     stateName: "West Bengal",
    //     cityName: "Kolkata",
    //     isActive: true,
    //     createdBy: "sajjany47",
    //     updatedBy: "sajjany47",
    //   },
    //   {
    //     name: "College Street",
    //     country: 101,
    //     state: 4853,
    //     city: 142001,
    //     email: "collegestreet@gmail.com",
    //     phone: "03312345697",
    //     address: "college street, kolkata",
    //     pincode: "700073",
    //     code: "CS00073",
    //     countryName: "India",
    //     stateName: "West Bengal",
    //     cityName: "Kolkata",
    //     isActive: true,
    //     createdBy: "sajjany47",
    //     updatedBy: "sajjany47",
    //   },
    // ];

    // await branch.insertMany(a);

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

    const data = await branch.aggregate([
      { $match: query.length > 0 ? { $and: query } : {} },
      {
        $facet: {
          count: [{ $count: "total" }],
          data: [
            {
              $sort: reqData.sort || { name: 1 },
            },
            { $skip: start },
            { $limit: limit },
          ],
        },
      },
    ]);

    return res.status(StatusCodes.OK).json({
      message: "Data fetched successfully",
      data: data[0].data,
      count: data[0].count[0].total,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};
