import { REGEX } from "../constants/regex";

export const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

export const isValidEmail = (email: string): boolean => {
  return REGEX.EMAIL.test(normalizeEmail(email));
};
