import { LineItem } from '../contracts'

export const isVendor = (text: string) => /\bTradepoint\b|\bb\s*&\s*q\b|diy\.com/i.test(text)

export function extractTotals(text: string){
  let total: number|undefined, tax_vat: number|undefined, discount: number|undefined
  for (const ln of text.split(/\r?\n/)){
    if (/vat|v\.a\.t|tax/i.test(ln)) tax_vat ??= num(ln)
    if (/discount|saving|loyalty|tp\s*10%\s*loyalty/i.test(ln)) discount ??= num(ln)
    if (/total|amount\s*due|grand\s*total|balance/i.test(ln)) total = max(total, num(ln))
  }
  return { total, tax_vat, discount }
}

export function extractLineItems(text: string): LineItem[] {
  const items: LineItem[] = []
  for (const ln of text.split(/\r?\n/)){
    // Loose: name ... qty x unit = total
    const m = ln.match(/^(.+?)\s+(\d+)\s*x\s*([£$€]?[\d\.,]+)\s*=\s*([£$€]?[\d\.,]+)/i)
    if (m){
      const name = m[1].trim()
      items.push({ name, qty: toNum(m[2]), unit_price: toNum(m[3]), total: toNum(m[4]) })
      continue
    }
  }
  return items
}

const toNum = (s:string)=> Number((s||'').toString().replace(/[^0-9.,-]/g,'').replace(',', '.'))
const num = (s:string)=>{ const n=toNum(s); return isNaN(n)?undefined:n }
const max = (a?:number,b?:number)=> (a===undefined)?b: (b===undefined? a : Math.max(a,b))


