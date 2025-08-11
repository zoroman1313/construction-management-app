import { LineItem } from '../contracts'

export const isVendor = (text: string) => /Topps\s*Tiles|toppstiles\.co\.uk/i.test(text)

export function extractTotals(text: string){
  let total: number|undefined, tax_vat: number|undefined, discount: number|undefined
  for (const ln of text.split(/\r?\n/)){
    if (/vat|v\.a\.t|tax/i.test(ln)) tax_vat ??= num(ln)
    if (/discount|saving|loyalty/i.test(ln)) discount ??= num(ln)
    if (/total|amount\s*due|grand\s*total|balance/i.test(ln)) total = max(total, num(ln))
  }
  return { total, tax_vat, discount }
}

export function extractLineItems(text: string): LineItem[]{
  const items: LineItem[] = []
  const lines = text.split(/\r?\n/)
  for (let i=0;i<lines.length;i++){
    const name = lines[i].trim()
    if (!name || name.length < 2) continue
    const next = (lines[i+1]||'').trim()
    // Match: SKU 123456  2 x 3.50  or  SKU 123456  2 @ 3.50
    const m = next.match(/sku\s*\d+\D+?(\d+(?:\.\d+)?)\s*(?:x|@)\s*([£$€]?\s*[\d\.,]+)/i)
    if (m){
      const qty = parseFloat(m[1])
      const unit = toNum(m[2])
      items.push({ name, qty, unit_price: unit, total: qty && unit ? +(qty*unit).toFixed(2) : undefined })
      i++
      continue
    }
  }
  return items
}

const toNum = (s:string)=> Number(s.replace(/[^0-9.,-]/g,'').replace(',', '.'))
const num = (s:string)=>{ const n=toNum(s); return isNaN(n)?undefined:n }
const max = (a?:number,b?:number)=> (a===undefined)?b: (b===undefined? a : Math.max(a,b))


