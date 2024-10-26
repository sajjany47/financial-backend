export const DataManage = (data) => {
  const prepareData = {
    name: data.name,
    mobile: data.mobile,
    email: data.email,
    dob: data.dob,
    investmentType: data.investmentType,
    investmentAmount: data.investmentAmount,
    duration: data.duration,
    interestRate: data.interestRate,
    payoutFrequency: data.payoutFrequency,
    payoutDate: data.payoutDate,
    accountNumber: data.accountNumber,
    bankName: data.bankName,
    bankBranchName: data.bankBranchName,
    ifsc: data.ifsc,
    accountName: data.accountName,
  };
  return prepareData;
};
