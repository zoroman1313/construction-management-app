export const toPounds = (n?: number) => (typeof n === 'number' ? n : 0);
export const gbp = (n?: number) => `£${(toPounds(n)).toFixed(2)}`;


