export const EmployeeBasicData = (data) => {
  const prepareData = {
    name: data.name,
    username: data.username,
    mobile: data.mobile,
    email: data.email,
    dob: data.dob,
    position: data.position,
    address: data.address,
    state: Number(data.state),
    country: Number(data.country),
    city: Number(data.city),
    pincode: data.pincode,
    branch: new mongoose.Types.ObjectId(data.branch),
    fresherOrExperience: data.fresherOrExperience,
    pageIndex: 0,
  };

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
    applicationStaus: LoanStatusEnum.INCOMPLETED,
    status: LoanApplicationStepsEnum.INCOMPLETED,
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
