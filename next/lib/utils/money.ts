export const toPounds = (n?: number) => (typeof n === 'number' ? n : 0);
export const gbp = (n?: number) => `£${toPounds(n).toFixed(2)}`;

export const parseAmount = (s: string) => {
  const m = s.replace(/[^0-9.,-]/g, '').replace(',', '.');
  const n = Number(m);
  return isNaN(n) ? undefined : n;
};


