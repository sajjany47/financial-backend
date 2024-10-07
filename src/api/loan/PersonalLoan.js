import mongoose from "mongoose";
import { DisbursmentCalculate, EMICalculator } from "./loan.config.js";

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
    status: "incompleted",
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
    status: "incompleted",
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
    status: "incompleted",
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
    applicationStaus: "progress",
    status: "application_number_generated",
    activeIndex: -1,
  };

  return prepareData;
};

export const StatusData = (data) => {
  let prepareData = {
    applicationStaus:
      data.status === "loan_approved"
        ? "approved"
        : data.status === "rejected"
        ? "rejected"
        : data.status === "disbursed"
        ? "disbursed"
        : data.status === "incompleted"
        ? "incompleted"
        : "progress",
    status: data.status,
    remark: data.remark,
  };

  if (data.loanAllotAgent) {
    prepareData.loanAllotAgent = data.user;
  }

  if (data.status === "document_address_verification") {
    prepareData.addressVerifiedBy = data.user;
  }
  if (data.status === "business_address_verification") {
    prepareData.officeOrBussinessVerifiedBy = data.user;
  }
  if (data.status === "document_verification") {
    prepareData.documentVerifiedBy = data.user;
  }
  if (data.status === "loan_approved") {
    prepareData.loanVerifiedBy = data.user;
    prepareData.interestRate = data.interestRate;
  }

  if (data.status === "disbursed") {
    const EMI = EMICalculator({
      loanAmount: Number(data.loanAmount),
      interestRate: Number(data.interestRate),
      loanTenure: Number(data.loanTenure),
      foreclosureFees: data.charges.foreclosureFees,
      foreclosureFeesGST: data.charges.foreclosureFeesGST,
      startDate: data.emiDate,
    });

    const disbursment = DisbursmentCalculate({
      processingFees: data.charges.processingFees,
      processingFeesGST: data.charges.processingFeesGST,
      loginFees: data.charges.loginFees,
      loginFeesGST: data.charges.loginFeesGST,
      otherCharges: data.charges.otherCharges,
      otherChargesGST: data.charges.otherChargesGST,
      loanAmount: Number(data.loanAmount),
    });
    prepareData.disbursedBy = data.user;
    prepareData.EMIMonthly = EMI.emi;
    prepareData.emiSchedule = EMI.emiSchedule;
    prepareData.disbursment = disbursment;
  }

  return prepareData;
};
