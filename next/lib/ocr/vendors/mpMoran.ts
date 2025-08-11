import { LineItem } from '../contracts'

export const isVendor = (text: string) => /\bMP\s*Moran\b|mpmoran\.co\.uk/i.test(text)

export function extractTotals(text: string){
  let total: number|undefined, tax_vat: number|undefined, discount: number|undefined
  for (const ln of text.split(/\r?\n/)){
    if (/vat|v\.a\.t|tax/i.test(ln)) tax_vat ??= num(ln)
    if (/discount|saving|loyalty/i.test(ln)) discount ??= num(ln)
    if (/total|amount\s*due|grand\s*total|balance/i.test(ln)) total = max(total, num(ln))
  }
  return { total, tax_vat, discount }
}

export function extractLineItems(text: string): LineItem[] {
  const items: LineItem[] = []
  for (const ln of text.split(/\r?\n/)){
    // Pattern 1: NAME then code line "... 1 EA @ 3.20"
    const m1 = ln.match(/^(.+?)\s+(\d+)\s*(EA|PCS|UNIT)?\s*@\s*([£$€]?\s*[\d\.,]+)/i)
    if (m1){
      const name = m1[1].trim()
      const qty = toNum(m1[2])
      const unit = toNum(m1[4])
      items.push({ name, qty, unit_price: unit, total: qty && unit ? +(qty*unit).toFixed(2) : undefined })
      continue
    }
    // Pattern 2: two-line with code containing qty/price
    const m2 = ln.match(/^(.+?)$/)
    if (m2){
      // will rely on next line if formatted
      // handled loosely by scanning ahead (not implemented for brevity)
    }
  }
  return items
}

const toNum = (s:string)=> Number((s||'').toString().replace(/[^0-9.,-]/g,'').replace(',', '.'))
const num = (s:string)=>{ const n=toNum(s); return isNaN(n)?undefined:n }
const max = (a?:number,b?:number)=> (a===undefined)?b: (b===undefined? a : Math.max(a,b))


