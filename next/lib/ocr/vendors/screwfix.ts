import { LineItem } from '../contracts'

export const isVendor = (text: string) => /screwfix/i.test(text) || /www\.screwfix\.com/i.test(text)

export function extractTotals(text: string){
  let total: number|undefined, tax_vat: number|undefined, discount: number|undefined
  for (const ln of text.split(/\r?\n/)){
    if (/vat/i.test(ln)) tax_vat ??= num(ln)
    if (/discount|promo/i.test(ln)) discount ??= num(ln)
    if (/total|amount due|grand total/i.test(ln)) total = max(total, num(ln))
  }
  return { total, tax_vat, discount }
}

export function extractLineItems(text: string): LineItem[] {
  const items: LineItem[] = []
  for (const ln of text.split(/\r?\n/)){
    const m = ln.match(/^(.+?)\s+(\d+)x?\s+([\d\.,]+)\s*=\s*([\d\.,]+)/i)
    if (m) items.push({ name: m[1].trim(), qty: +m[2], unit_price: toNum(m[3]), total: toNum(m[4]) })
  }
  return items
}

const toNum = (s:string)=> Number(s.replace(/[^0-9.,-]/g,'').replace(',', '.'))
const num = (s:string)=>{ const n=toNum(s); return isNaN(n)? undefined : n }
const max = (a?:number,b?:number)=> (a===undefined)? b : (b===undefined? a : Math.max(a,b))


