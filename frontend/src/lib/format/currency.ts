export const formatCurrency = (value: string | number): string => {
  const numericValue = typeof value === "string" ? value.replace(/\D/g, "") : value.toString();
  if (!numericValue) return "";
  
  const amount = parseInt(numericValue, 10) / 100;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
};

export const parseCurrency = (value: string): number => {
  const numericValue = value.replace(/\D/g, "");
  return numericValue ? parseInt(numericValue, 10) / 100 : 0;
};
