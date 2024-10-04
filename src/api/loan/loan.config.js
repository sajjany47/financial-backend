export const EmployeeTypes = ["salaried", "self_employed", "business"];

export const LoanApplicationSteps = [
  "incompleted",
  "application_number_generated",
  "loan_amount_generated",
  "document_address_verification",
  "business_address_verification",
  "document_verification",
  "loan_amount_approved_processing",
  "loan_approved",
  "rejected",
];

export const ResidenceTypes = ["rented", "owned", "parent"];

export const LoanTypes = [
  "personal_loan",
  "home_loan",
  "car_loan",
  "education_loan",
  "business_loan",
  "payday_loan",
  "gold_loan",
  "mortgage_loan",
  "credit_card_loan",
  "agriculture_loan",
];

export const GenerateApplicationNumber = (loanType) => {
  const loanPrefixes = {
    personal_loan: "PLN",
    home_loan: "HLN",
    car_loan: "CLN",
    education_loan: "ELN",
    business_loan: "BLN",
    payday_loan: "PDL",
    gold_loan: "GLN",
    mortgage_loan: "MLN",
    credit_card_loan: "CCL",
    agriculture_loan: "ALN",
  };

  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const randomNumber = Math.floor(1000 + Math.random() * 9000);

  const prefix = loanPrefixes[loanType] || "GEN";

  return `${prefix}${year}${month}${day}${randomNumber}`;
};

// const myPincode = 700053;
// const pincodes = [700026, 700045, 700007, 700012, 700057, 700001];

// // Function to find the nearest pincode
// function findNearestPincode(myPincode, pincodes) {
//   return pincodes.reduce((nearest, currentPincode) => {
//     return Math.abs(currentPincode - myPincode) < Math.abs(nearest - myPincode)
//       ? currentPincode
//       : nearest;
//   });
// }

// const nearestPincode = findNearestPincode(myPincode, pincodes);
// console.log(`The nearest pincode is: ${nearestPincode}`);
