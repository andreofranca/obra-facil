import { parseDateToISO } from "../format/date";

export const isValidDate = (date: string): boolean => {
  return parseDateToISO(date) !== null;
};

export const isFutureOrTodayDate = (date: string): boolean => {
  if (date === "O mais rápido possível") return true; // Preparado para o futuro
  const isoDate = parseDateToISO(date);
  if (!isoDate) return false;
  
  const parsedDate = new Date(isoDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to compare only date

  return parsedDate >= today;
};
