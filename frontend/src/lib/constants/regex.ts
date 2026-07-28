export const REGEX = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/,
  CEP: /^\d{5}-?\d{3}$/,
  CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  ONLY_NUMBERS: /^\d+$/,
  PASSWORD: {
    UPPERCASE: /[A-Z]/,
    LOWERCASE: /[a-z]/,
    NUMBER: /[0-9]/,
    SPECIAL: /[^A-Za-z0-9]/,
  },
};
