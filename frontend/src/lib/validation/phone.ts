import { REGEX } from "../constants/regex";
import { clearPhone } from "../format/phone";

export const isValidPhone = (phone: string): boolean => {
  const cleanPhone = clearPhone(phone);
  if (cleanPhone.length < 10 || cleanPhone.length > 11) return false;
  
  // Basic validation using Regex
  return REGEX.PHONE.test(phone);
};
