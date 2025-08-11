import { LineItem } from '../contracts'

export const isVendor = (text: string) => /\bChris\s*Stevens\b|chrisstevensltd\.co\.uk/i.test(text)

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
    // Columns: Product, Unit price, Quantity, Line total
    const m = ln.match(/^(.+?)\s+([£$€]?[\d\.,]+)\s+(\d+(?:\.\d+)?)\s+([£$€]?[\d\.,]+)(?:\s*-\s*\d+\.\d+%\s*discount)?/i)
    if (m){
      const name = m[1].trim()
      const unit = toNum(m[2])
      const qty = toNum(m[3])
      const total = toNum(m[4])
      items.push({ name, qty, unit_price: unit, total: total || (qty && unit ? +(qty*unit).toFixed(2) : undefined) })
      continue
    }
  }
  return items
}

const toNum = (s:string)=> Number((s||'').toString().replace(/[^0-9.,-]/g,'').replace(',', '.'))
const num = (s:string)=>{ const n=toNum(s); return isNaN(n)?undefined:n }
const max = (a?:number,b?:number)=> (a===undefined)?b: (b===undefined? a : Math.max(a,b))


