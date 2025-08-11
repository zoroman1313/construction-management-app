import { IReceiptParser, ReceiptParseRequest, ReceiptParseResult } from './contracts'
import { parseAmount } from '@/lib/utils/money'
import * as screwfix from './vendors/screwfix'
import * as bq from './vendors/bq'
import * as toolstation from './vendors/toolstation'
import * as toppsTiles from './vendors/toppsTiles'
import * as mpMoran from './vendors/mpMoran'
import * as wickes from './vendors/wickes'
import * as chrisStevens from './vendors/chrisStevens'
import * as tradepoint from './vendors/tradepoint'

const KNOWN_VENDORS = ['Screwfix','B&Q','Toolstation','Wickes','Builders Depot','Topps Tiles','MP Moran','Chris Stevens','TradePoint']

function detectVendor(text: string): string | undefined {
  const t = text.toLowerCase()
  if (screwfix.isVendor(text)) return 'Screwfix'
  if (bq.isVendor(text)) return 'B&Q'
  if (toolstation.isVendor(text)) return 'Toolstation'
  if (toppsTiles.isVendor(text)) return 'Topps Tiles'
  if (mpMoran.isVendor(text)) return 'MP Moran'
  if (wickes.isVendor(text)) return 'Wickes'
  if (chrisStevens.isVendor(text)) return 'Chris Stevens'
  if (tradepoint.isVendor(text)) return 'TradePoint'
  for (const v of KNOWN_VENDORS) {
    if (t.includes(v.toLowerCase().replace('&','&'))) return v
  }
}

function extractDate(text: string): string | undefined {
  const patterns = [
    /\b(\d{2})[\/\-\.](\d{2})[\/\-\.](\d{4})\b/,
    /\b(\d{4})[\/\-\.](\d{2})[\/\-\.](\d{2})\b/,
  ]
  for (const r of patterns) {
    const m = text.match(r)
    if (m) {
      if (r === patterns[0]) {
        const [_all, dd, mm, yyyy] = m
        return `${yyyy}-${mm}-${dd}`
      } else {
        const [full] = m
        return full.replace(/[\.]/g, '-')
      }
    }
  }
}

function extractPayment(text: string): { method: 'Cash'|'Card'|'BankTransfer'|'Unknown'; bank?: string|null } {
  const T = text.toUpperCase()
  if (T.includes('CASH')) return { method: 'Cash' }
  if (T.includes('TRANSFER') || T.includes('BANK TRANSFER')) return { method: 'BankTransfer' }
  if (T.includes('CARD') || T.includes('VISA') || T.includes('MASTERCARD')) return { method: 'Card' }
  return { method: 'Unknown' }
}

function extractTotalsGeneric(text: string){
  const lines = text.split(/\r?\n/)
  let total: number|undefined, vat: number|undefined, discount: number|undefined
  for (const ln of lines) {
    if (/vat|tax/i.test(ln)) vat ??= parseAmount(ln)
    if (/discount|promo|off/i.test(ln)) discount ??= parseAmount(ln)
    if (/total|amount due|grand total|balance/i.test(ln)) {
      const n = parseAmount(ln)
      if (n !== undefined) total = total ? Math.max(total, n) : n
    }
  }
  return { total, tax_vat: vat, discount }
}

export const parserLocal: IReceiptParser = {
  async parse(req: ReceiptParseRequest): Promise<ReceiptParseResult> {
    const image_url = req.fileUrl
    let raw_text = ''
    let vendor: string | undefined = undefined

    // Allow client to pass raw_text in future; otherwise keep minimal
    const maybeRaw: unknown = (req as any).raw_text
    if (typeof maybeRaw === 'string' && maybeRaw.length > 10) {
      raw_text = maybeRaw
      vendor = detectVendor(raw_text)
      const date = extractDate(raw_text)
      const payment = extractPayment(raw_text)

      let line_items: any[] = []
      let totals = extractTotalsGeneric(raw_text)
      if (vendor === 'Screwfix') {
        totals = { ...totals, ...screwfix.extractTotals(raw_text) }
        line_items = screwfix.extractLineItems(raw_text)
      } else if (vendor === 'B&Q') {
        totals = { ...totals, ...bq.extractTotals(raw_text) }
        line_items = bq.extractLineItems(raw_text)
      } else if (vendor === 'Toolstation') {
        totals = { ...totals, ...toolstation.extractTotals(raw_text) }
        line_items = toolstation.extractLineItems(raw_text)
      } else if (vendor === 'Topps Tiles') {
        totals = { ...totals, ...toppsTiles.extractTotals(raw_text) }
        line_items = toppsTiles.extractLineItems(raw_text)
      } else if (vendor === 'MP Moran') {
        totals = { ...totals, ...mpMoran.extractTotals(raw_text) }
        line_items = mpMoran.extractLineItems(raw_text)
      } else if (vendor === 'Wickes') {
        totals = { ...totals, ...wickes.extractTotals(raw_text) }
        line_items = wickes.extractLineItems(raw_text)
      } else if (vendor === 'Chris Stevens') {
        totals = { ...totals, ...chrisStevens.extractTotals(raw_text) }
        line_items = chrisStevens.extractLineItems(raw_text)
      } else if (vendor === 'TradePoint') {
        totals = { ...totals, ...tradepoint.extractTotals(raw_text) }
        line_items = tradepoint.extractLineItems(raw_text)
      }

      const matched = ['vendor','date','total','payment'].filter(Boolean).length
      const confidence = Math.min(1, 0.4 + matched * 0.15)

      return {
        vendor,
        date,
        total: totals.total,
        tax_vat: totals.tax_vat,
        discount: totals.discount,
        payment_method: payment.method,
        bank: payment.bank ?? null,
        currency: 'GBP',
        line_items,
        confidence,
        raw_text,
        image_url,
      }
    }

    return {
      vendor,
      currency: 'GBP',
      confidence: 0.2,
      raw_text,
      image_url,
    }
  },
}

export default parserLocal


