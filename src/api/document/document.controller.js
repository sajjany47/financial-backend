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
          country: validateData.country.map((item) => Number(item)),
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
            country: validateData.country.map((item) => Number(item)),
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

          country: validateData.country.map((item) => Number(item)),
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
            country: validateData.country.map((item) => Number(item)),
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
    let query = {};
    if (req.body.hasOwnProperty("isActive")) {
      query.isActive = req.body.isActive;
    }

    const list = await documentType.find(
      Object.keys(query).length > 0 ? query : {}
    );
    res
      .status(StatusCodes.OK)
      .json({ message: "Data fetched successfully", data: list });
  } catch (error) {
    next(error);
  }
};

export const documentList = async (req, res, next) => {
  try {
    let query = {};
    if (req.body.hasOwnProperty("isActive")) {
      query.isActive = req.body.isActive;
    }
    const list = await document.aggregate([
      {
        $match: Object.keys(query).length > 0 ? query : {},
      },
      {
        $lookup: {
          from: "countries",
          localField: "country",
          foreignField: "id",
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
                _id: "$$c.id",
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
    let query = {};
    if (req.body.hasOwnProperty("isActive")) {
      query.isActive = req.body.isActive;
    }
    const list = await loanType.aggregate([
      {
        $match: Object.keys(query).length > 0 ? query : {},
      },
      {
        $lookup: {
          from: "countries",
          localField: "country",
          foreignField: "id",
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
                _id: "$$c.id",
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

export const getDocumentList = async (req, res, next) => {
  try {
    const list = await document.aggregate([
      {
        $match: {
          isActive: true,
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
        $unwind: {
          path: "$loanType",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "countries",
          localField: "country",
          foreignField: "id",
          as: "country",
        },
      },
      {
        $unwind: {
          path: "$country",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          "loanType._id": new mongoose.Types.ObjectId(req.body.loanTypeId),
          "loanType.isActive": true,
          "documentType.isActive": true,
          "country.id": req.body.country,
        },
      },
      {
        $group: {
          _id: "$documentType._id",
          documentType: {
            $first: "$documentType.name",
          },
          description: {
            $first: "$documentType.description",
          },
          entity: { $first: "$documentType.entity" },
          document: {
            $push: {
              _id: "$_id",
              name: "$documentName",
              entity: "$entity",
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

export const getLoanTypeList = async (req, res, next) => {
  try {
    const list = await loanType.aggregate([
      {
        $match: {
          isActive: true,
        },
      },
      {
        $lookup: {
          from: "countries",
          localField: "country",
          foreignField: "id",
          as: "country",
        },
      },
      {
        $unwind: {
          path: "$country",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: req.body.hasOwnProperty("country")
          ? {
              "country.id": req.body.country,
            }
          : {},
      },
      {
        $project: {
          name: 1,
          entity: 1,
          icon: 1,
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
