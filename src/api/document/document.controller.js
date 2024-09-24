import { StatusCodes } from "http-status-codes";
import documentType from "./documentType.model.js";
import mongoose from "mongoose";
import document from "./document.model.js";
import loanType from "./loanType.model.js";

export const typeCreate = async (req, res, next) => {
  try {
    const validateData = req.body;
    if (validateData) {
      const checkName = await documentType.findOne({
        name: { $regex: `^${validateData.name}`, $options: "i" },
      });
      if (checkName) {
        return res
          .status(StatusCodes.CONFLICT)
          .json({ message: "Name already present in database" });
      } else {
        const data = new documentType({
          name: validateData.name,
          description: validateData.description,
          entity: validateData.name.toLowerCase().replace(/ /g, "_"),
          isActive: true,
          createdBy: req.user.username,
        });

        await data.save();

        return res
          .status(StatusCodes.OK)
          .json({ message: "Document type created successfully" });
      }
    }
  } catch (error) {
    next(error);
    // res.status(StatusCodes.BAD_REQUEST).json({ message: error });
  }
};

export const typeUpdate = async (req, res) => {
  try {
    const validateData = req.body;
    if (validateData) {
      await documentType.updateOne(
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
    next(error);
    // res.status(StatusCodes.BAD_REQUEST).json({ message: error });
  }
};

export const documentCreate = async (req, res, next) => {
  try {
    const validateData = req.body;
    if (validateData) {
      const checkName = await documentType.findOne({
        documentName: {
          $regex: `^${validateData.documentName}`,
          $options: "i",
        },
      });
      if (checkName) {
        return res
          .status(StatusCodes.CONFLICT)
          .json({ message: "Name already present in database" });
      } else {
        const data = new document({
          documentType: new mongoose.Types.ObjectId(validateData.documentType),
          loanType: validateData.loanType.map(
            (item) => new mongoose.Types.ObjectId(item)
          ),
          documentName: validateData.documentName,
          entity: validateData.documentName.toLowerCase().replace(/ /g, "_"),
          country: validateData.country.map(
            (item) => new mongoose.Types.ObjectId(item)
          ),
          optional: validateData.optional,
          isActive: true,
          createdBy: req.user.username,
        });

        await data.save();

        return res
          .status(StatusCodes.OK)
          .json({ message: "Document created successfully" });
      }
    }
  } catch (error) {
    next(error);
    // res.status(StatusCodes.BAD_REQUEST).json({ message: error });
  }
};

export const documentUpdate = async (req, res) => {
  try {
    const validateData = req.body;
    if (validateData) {
      await document.updateOne(
        {
          _id: new mongoose.Types.ObjectId(validateData._id),
        },
        {
          $set: {
            documentType: new mongoose.Types.ObjectId(
              validateData.documentType
            ),
            loanType: validateData.loanType.map(
              (item) => new mongoose.Types.ObjectId(item)
            ),
            documentName: validateData.documentName,
            country: validateData.country.map(
              (item) => new mongoose.Types.ObjectId(item)
            ),
            optional: validateData.optional,
            isActive: validateData.isActive,
            updatedBy: req.user.username,
          },
        }
      );

      return res
        .status(StatusCodes.OK)
        .json({ message: "Document type updated successfully" });
    }
  } catch (error) {
    next(error);
    // res.status(StatusCodes.BAD_REQUEST).json({ message: error });
  }
};

export const loanTypeCreate = async (req, res, next) => {
  try {
    const validateData = req.body;
    if (validateData) {
      const checkName = await loanType.findOne({
        name: {
          $regex: `^${validateData.name}`,
          $options: "i",
        },
      });
      if (checkName) {
        return res
          .status(StatusCodes.CONFLICT)
          .json({ message: "Name already present in database" });
      } else {
        const data = new loanType({
          name: validateData.name,
          entity: validateData.name.toLowerCase().replace(/ /g, "_"),
          icon: validateData.icon,
          country: validateData.country.map(
            (item) => new mongoose.Types.ObjectId(item)
          ),
          isActive: true,
          createdBy: req.user.username,
        });

        await data.save();

        return res
          .status(StatusCodes.OK)
          .json({ message: "Loan type created successfully" });
      }
    }
  } catch (error) {
    next(error);
    // res.status(StatusCodes.BAD_REQUEST).json({ message: error });
  }
};

export const loanTypeUpdate = async (req, res) => {
  try {
    const validateData = req.body;
    if (validateData) {
      await loanType.updateOne(
        {
          _id: new mongoose.Types.ObjectId(validateData._id),
        },
        {
          $set: {
            name: validateData.name,
            country: validateData.country.map(
              (item) => new mongoose.Types.ObjectId(item)
            ),
            icon: validateData.icon,
            isActive: validateData.isActive,
            updatedBy: req.user.username,
          },
        }
      );

      return res
        .status(StatusCodes.OK)
        .json({ message: "Loan type updated successfully" });
    }
  } catch (error) {
    next(error);
    // res.status(StatusCodes.BAD_REQUEST).json({ message: error });
  }
};

export const typeList = async (req, res, next) => {
  try {
    const list = await documentType.find({});
    res
      .status(StatusCodes.OK)
      .json({ message: "Data fetched successfully", data: list });
  } catch (error) {
    next(error);
  }
};

export const documentList = async (req, res, next) => {
  try {
    const list = await document.aggregate([
      {
        $match: {},
      },
      {
        $lookup: {
          from: "countries",
          localField: "country",
          foreignField: "_id",
          as: "country",
        },
      },

      {
        $lookup: {
          from: "documenttypes",
          localField: "documentType",
          foreignField: "_id",
          as: "documentType",
        },
      },
      {
        $unwind: {
          path: "$documentType",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "loantypes",
          localField: "loanType",
          foreignField: "_id",
          as: "loanType",
        },
      },
      {
        $project: {
          isActive: 1,
          createdBy: 1,
          updatedBy: 1,
          documentName: 1,
          documentType: {
            name: "$documentType.name",
            _id: "$documentType._id",
            entity: "$documentType.entity",
          },
          country: {
            $map: {
              input: "$country",
              as: "c",
              in: {
                name: "$$c.name",
                _id: "$$c._id",
              },
            },
          },
          loanType: {
            $map: {
              input: "$loanType",
              as: "l",
              in: {
                name: "$$l.name",
                _id: "$$l._id",
                entity: "$$l.entity",
              },
            },
          },
        },
      },
    ]);

    res
      .status(StatusCodes.OK)
      .json({ message: "Data fetched successfully", data: list });
  } catch (error) {
    next(error);
  }
};
export const loanTypeList = async (req, res, next) => {
  try {
    const list = await loanType.aggregate([
      {
        $lookup: {
          from: "countries",
          localField: "country",
          foreignField: "_id",
          as: "country",
        },
      },
      {
        $project: {
          name: 1,
          entity: 1,
          icon: 1,
          isActive: 1,
          createdBy: 1,
          updatedBy: 1,
          country: {
            $map: {
              input: "$country",
              as: "c",
              in: {
                name: "$$c.name",
                _id: "$$c._id",
              },
            },
          },
        },
      },
    ]);
    res
      .status(StatusCodes.OK)
      .json({ message: "Data fetched successfully", data: list });
  } catch (error) {
    next(error);
  }
};
