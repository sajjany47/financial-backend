import { customAlphabet } from "nanoid";

export const url = "https://demo.com";
export const generateEmployeeId = () => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";

  const employeeId = customAlphabet(alphabet, 6);

  return employeeId.toUpperCase();
};

export const generatePassword = () => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789#@!-_";

  const password = customAlphabet(alphabet, 8);

  return password;
};
