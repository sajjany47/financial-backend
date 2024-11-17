import mongoose from "mongoose";
import { Position } from "./EmployeeConfig.js";

export const EmployeeBasicData = (data) => {
  let prepareData = {
    name: data.name,
    username: data.username,
    mobile: data.mobile,
    email: data.email,
    dob: data.dob,
    position: data.position,
    pincode: data.pincode,
    fresherOrExperience: data.fresherOrExperience,
    pageIndex: 0,
  };

  if (
    data.position === Position.ADMIN ||
    data.position === Position.SM ||
    data.position === Position.CM
  ) {
    if (data.position === Position.ADMIN) {
      prepareData.country = null;
      prepareData.state = null;
      prepareData.city = null;
      prepareData.branch = null;
    }
    if (data.position === Position.SM) {
      prepareData.country = data.country;
      prepareData.state = data.state;
      prepareData.city = null;
      prepareData.branch = null;
    }
    if (data.position === Position.CM) {
      prepareData.country = data.country;
      prepareData.state = data.state;
      prepareData.city = data.city;
      prepareData.branch = null;
    }
  } else {
    prepareData.country = data.country;
    prepareData.state = data.state;
    prepareData.city = data.city;
    prepareData.branch = new mongoose.Types.ObjectId(data.branch);
  }

  return prepareData;
};

export const EmployeeAddressData = (data) => {
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
    activeIndex: 1,
  };

  return prepareData;
};

export const EmployeeDocumentData = (data) => {
  const prepareData = {
    aadharNumber: data.aadharNumber,
    voterNumber: data.voterNumber,
    panNumber: data.panNumber,
    passportNumber: data.passportNumber,
    pageIndex: 3,
  };

  return prepareData;
};

export const EmployeeAccountData = (data) => {
  const prepareData = {
    bankName: data.bankName,
    accountNumber: data.accountNumber,
    bankBranchName: data.bankBranchName,
    ifsc: data.ifsc,
    uan: data.uan,
    pageIndex: 0,
  };

  return prepareData;
};
