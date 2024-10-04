import * as Yup from "yup";

export const LeadSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().required("Email is required"),
  mobile: Yup.string().required("Mobile number is required"),
  loanAmount: Yup.string().required("Loan amount is required"),
  loanTenure: Yup.string().required("Loan tenure is required"),
  loanType: Yup.string().required("Loan type is required"),
  monthlyIncome: Yup.string().required("Monthly income is required"),
});

export const PersonalLoanBasicSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  loanAmount: Yup.string().required("Loan amount is required"),
  loanTenure: Yup.string().required("Loan tenure is required"),
  mobile: Yup.string().required("Mobile number is required"),
  email: Yup.string().required("Email is required"),
  dob: Yup.date()
    .required("Date of birth is required")
    .max(new Date(Date.now() - 567648000000), "You must be at least 18 years"),
  branch: Yup.string().required("Branch is required"),
  fatherName: Yup.string().required("Father name is required"),
  motherName: Yup.string().required("Mother name is required"),
  loanType: Yup.string().required("Loan type is required"),
});

export const PersonalLoanAddressSchema = Yup.object().shape({
  permanentHouseOrBuildingNumber: Yup.string().required(
    "House or Building or Block number is required"
  ),
  permanentStreet: Yup.string().required("Street or Village name is required"),
  permanentLandmark: Yup.string().required("Land mark is required"),
  permanentPincode: Yup.string().required("Pincode is required"),
  residenceType: Yup.string().required("Residence Type is required"),
  permanentState: Yup.string().required("State is required"),
  permanentCountry: Yup.string().required("Country is required"),
  permanentCity: Yup.string().required("City is required"),
  residenceHouseOrBuildingNumber: Yup.string().required(
    "House or Building or Block number is required"
  ),
  residenceStreet: Yup.string().required("Street or Village name is required"),
  residenceLandmark: Yup.string().required("Land mark is required"),
  residencePincode: Yup.string().required("Pincode is required"),
  residenceState: Yup.string().required("State is required"),
  residenceCountry: Yup.string().required("Country is required"),
  residenceCity: Yup.string().required("City is required"),
});

export const PersonalLoanWorkSchema = Yup.object().shape({
  companyOrBussinessName: Yup.string().required(
    "Company or Business is required"
  ),
  jobTitle: Yup.string().required("Job title is required"),
  employmentType: Yup.string().required("Employment type is required"),
  yearsOfExperience: Yup.string().required("Year of experience is required"),
  monthlyIncome: Yup.string().required("Monthly income is required"),
  shopOrBuildingNumber: Yup.string().required(
    "Shop or Building or Block number is required"
  ),
  workStreet: Yup.string().required("Street or Village name is required"),
  workLandmark: Yup.string().required("Land mark is required"),
  workPincode: Yup.string().required("Pincode is required"),
  workState: Yup.string().required("State is required"),
  workCountry: Yup.string().required("Country is required"),
  workCity: Yup.string().required("City is required"),
});

export const PersonalLoanDocumentSchema = Yup.object().shape({
  applicationType: Yup.string().required("Application type is required"),
});

export const PersonalLoanAccountSchema = Yup.object().shape({
  bankName: Yup.string().required("Bank name is required"),
  accountNumber: Yup.string().required("Account number is required"),
  bankBranchName: Yup.string().required("Branch name is required"),
  ifsc: Yup.string().required("IFSC code is required"),
  accountName: Yup.string().required("Account name is required"),
});
