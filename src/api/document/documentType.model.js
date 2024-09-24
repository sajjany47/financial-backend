import mongoose from "mongoose";

const documentTypeModel = new mongoose.Schema(
  {
    name: String,
    entity: String,
    description: String,
    isActive: Boolean,
    createdBy: String,
    updatedBy: String,
  },
  { timestamps: true }
);

const documentType = mongoose.model("documentType", documentTypeModel);

export default documentType;
