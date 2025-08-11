import { LineItem } from '../contracts'

export const isVendor = (text: string) => /\bWickes\b|trustpilot|wickes\.co\.uk/i.test(text)

export function extractTotals(text: string){
  let total: number|undefined, tax_vat: number|undefined, discount: number|undefined
  for (const ln of text.split(/\r?\n/)){
    if (/vat|v\.a\.t|tax/i.test(ln)) tax_vat ??= num(ln)
    if (/discount|saving|project\s*saving|loyalty/i.test(ln)) discount ??= num(ln)
    if (/total|amount\s*due|grand\s*total|balance/i.test(ln)) total = max(total, num(ln))
  }
  return { total, tax_vat, discount }
}

export function extractLineItems(text: string): LineItem[] {
  const items: LineItem[] = []
  for (const ln of text.split(/\r?\n/)){
    // product line followed by @ £1.40 or QTY x UNIT
    const m1 = ln.match(/^(.+?)\s+@\s*([£$€]?[\d\.,]+)/i)
    if (m1){
      const name = m1[1].trim()
      const unit = toNum(m1[2])
      items.push({ name, unit_price: unit })
      continue
    }
    const m2 = ln.match(/^(.+?)\s+(\d+)\s*(?:x|qty)\s*([£$€]?[\d\.,]+)/i)
    if (m2){
      const name = m2[1].trim()
      const qty = toNum(m2[2])
      const unit = toNum(m2[3])
      items.push({ name, qty, unit_price: unit, total: qty && unit ? +(qty*unit).toFixed(2) : undefined })
      continue
    }
  }
  return items
}

const toNum = (s:string)=> Number((s||'').toString().replace(/[^0-9.,-]/g,'').replace(',', '.'))
const num = (s:string)=>{ const n=toNum(s); return isNaN(n)?undefined:n }
const max = (a?:number,b?:number)=> (a===undefined)?b: (b===undefined? a : Math.max(a,b))


