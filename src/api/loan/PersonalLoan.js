import mongoose from "mongoose";

export const LeadData = (data) => {
  const prepareData = {
    name: data.name,
    mobile: data.mobile,
    email: data.email,
    loanType: new mongoose.Types.ObjectId(data.loanType),
    loanAmount: Number(data.loanAmount),
    loanTenure: Number(data.loanTenure),
    monthlyIncome: Number(data.monthlyIncome),
    branch: new mongoose.Types.ObjectId(data.branch),
    applicationStaus: "lead",
  };

  return prepareData;
};

export const BasicData = (data) => {
  const prepareData = {
    loanAmount: Number(data.loanAmount),
    loanTenure: Number(data.loanTenure),
    name: data.name,
    mobile: data.mobile,
    email: data.email,
    dob: new Date(data.dob),
    branch: new mongoose.Types.ObjectId(data.branch),
    loanType: new mongoose.Types.ObjectId(data.loanType),
    fatherName: data.fatherName,
    motherName: data.motherName,
    applicationStaus: "incompleted",
    activeIndex: 0,
  };

  return prepareData;
};

export const AddressData = (data) => {
  const prepareData = {
    permanentHouseOrBuildingNumber: data.permanentHouseOrBuildingNumber,
    permanentStreet: data.permanentStreet,
    permanentLandmark: data.permanentLandmark,
    permanentPincode: data.permanentPincode,
    permanentState: Number(data.permanentState),
    permanentCountry: Number(data.permanentCountry),
    permanentCity: Number(data.permanentCity),
    residenceHouseOrBuildingNumber: data.residenceHouseOrBuildingNumber,
    residenceStreet: data.residenceStreet,
    residenceLandmark: data.residenceLandmark,
    residencePincode: data.residencePincode,
    residenceState: Number(data.residenceState),
    residenceCountry: Number(data.residenceCountry),
    residenceCity: Number(data.residenceCity),
    addressSame: data.addressSame,
    residenceType: data.residenceType,
    applicationStaus: "incompleted",
    activeIndex: 1,
  };

  return prepareData;
};

export const WorkData = (data) => {
  const prepareData = {
    companyOrBussinessName: data.companyOrBussinessName,
    jobTitle: data.jobTitle,
    employmentType: data.employmentType,
    yearsOfExperience: Number(data.yearsOfExperience),
    monthlyIncome: Number(data.monthlyIncome),
    shopOrBuildingNumber: data.shopOrBuildingNumber,
    workStreet: data.workStreet,
    workLandmark: data.workLandmark,
    workPincode: data.workPincode,
    workState: Number(data.workState),
    workCountry: Number(data.workCountry),
    workCity: Number(data.workCity),
    applicationStaus: "incompleted",
    activeIndex: 2,
  };

  return prepareData;
};

export const AccountData = (data) => {
  const prepareData = {
    accountNumber: data.accountNumber,
    bankName: data.bankName,
    bankBranchName: data.bankBranchName,
    ifsc: data.ifsc,
    accountName: data.accountName,
    applicationStaus: "in_progress",
    status: "application_number_generated",
    activeIndex: 4,
  };

  return prepareData;
};
