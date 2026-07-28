export const formatDate = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2");
};

export const clearDate = (value: string): string => value.replace(/\D/g, "");

export const parseDateToISO = (value: string): string | null => {
  if (value.length !== 10) return null;
  const [day, month, year] = value.split("/");
  if (!day || !month || !year) return null;
  
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (
    isNaN(date.getTime()) ||
    date.getDate() !== Number(day) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getFullYear() !== Number(year)
  ) {
    return null;
  }
  
  return date.toISOString();
};

export const parseISOToDate = (isoString: string): string => {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
