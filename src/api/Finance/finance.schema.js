import * as Yup from "yup";

export const financeSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  mobile: Yup.string().required("Mobile number is required"),
  email: Yup.string()
    // .matches("/S+@S+.S+/", "Please enter valid email")
    .required("Email is required"),
  dob: Yup.date()
    .required("Date of birth is required")
    .max(new Date(Date.now() - 567648000000), "You must be at least 18 years"),
  bankName: Yup.string().required("Bank name is required"),
  accountNumber: Yup.string().required("Account number is required"),
  bankBranchName: Yup.string().required("Branch name is required"),
  ifsc: Yup.string().required("IFSC code is required"),
  accountName: Yup.string().required("Account name is required"),
  investmentType: Yup.string().required("Investment type is required"),
  investmentAmount: Yup.string().required("Investment amount is required"),
  duration: Yup.string().required("Duration is required"),
  interestRate: Yup.string().required("Interest Rate is required"),
  payoutFrequency: Yup.string().required("Payout frequency is required"),
  payoutDate: Yup.string().required("Payout date is required"),
  aadharNumber: Yup.string().required("Aadhar Number is required"),
  panNumber: Yup.string().required("Pan number is required"),
});
