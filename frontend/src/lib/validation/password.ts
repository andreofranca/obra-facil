import { REGEX } from "../constants/regex";
import { LIMITS } from "../constants/limits";

export const isValidPassword = (password: string): boolean => {
  if (password.length < LIMITS.PASSWORD_MIN) return false;
  if (password.length > LIMITS.PASSWORD_MAX) return false;
  if (!REGEX.PASSWORD.UPPERCASE.test(password)) return false;
  if (!REGEX.PASSWORD.LOWERCASE.test(password)) return false;
  if (!REGEX.PASSWORD.NUMBER.test(password)) return false;
  if (!REGEX.PASSWORD.SPECIAL.test(password)) return false;
  
  return true;
};
