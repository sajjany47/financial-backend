import { GetFileName, GLocalImage } from "../../utilis/utilis.js";
import fs from "fs";

export const Position = {
  ADMIN: "admin",
  BM: "branch-manager",
  SM: "state-manager",
  CM: "city-manager",
  LM: "loan-manager",
  PM: "product-manager",
  CDM: "collection-department-head",
  CD: "collection-department",
  LD: "loan-department",
  VD: "verication-department",
  FM: "financial-manager",
};

export const Status = {
  PENDING: "pending",
  VERIFIED: "verified",
  REJECTED: "rejected",
};

export const fresherOrExperience = {
  FRESHER: "fresher",
  EXPERIENCE: "experience",
};

export const EmployeeDocumentImageUpload = async (
  actionType,
  findArray,
  productId,
  imageKey,
  uploadFile
) => {
  if (actionType !== "add") {
    const findEducationImage = findArray.find(
      (item) => item.id.toString() === productId
    );

    const deletePath = GLocalImage(
      findEducationImage[imageKey],
      process.env.EMPLOYEE_PATH
    );

    await fs.promises.unlink(deletePath);
  }
  const file = uploadFile;
  const fileName = GetFileName(uploadFile);
  const uploadPath = GLocalImage(fileName, process.env.EMPLOYEE_PATH);

  await file.mv(uploadPath);

  return fileName;
};
