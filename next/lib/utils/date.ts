export const parseAmount = (s: string) => {
  const m = s.replace(/[^0-9.,-]/g, '').replace(',', '.');
  const n = Number(m);
  return isNaN(n) ? undefined : n;
};

export const parsePossiblyEuropeanDate = (s?: string) => {
  if (!s) return undefined;
  // Try YYYY-MM-DD or DD/MM/YYYY
  const dmy = s.match(/(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})/);
  if (dmy){
    const d = Number(dmy[1]), m = Number(dmy[2]) - 1, y = Number(dmy[3].length===2? '20'+dmy[3]: dmy[3]);
    const dt = new Date(y, m, d);
    return isNaN(dt.getTime()) ? undefined : dt;
  }
  const iso = new Date(s);
  return isNaN(iso.getTime()) ? undefined : iso;
}


