export const formatMoney = (amount: string | number): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return num.toFixed(2);
};

export const isValidAmount = (amount: number): boolean => {
  return amount > 0 && Number.isFinite(amount) && amount <= 9999999999.99;
};

export const toDecimal = (amount: number): string => {
  return amount.toFixed(2);
};
