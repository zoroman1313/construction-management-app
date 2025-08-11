import Tesseract from 'tesseract.js'
import { IReceiptParser, ReceiptParseRequest, ReceiptParseResult } from './contracts'
import { parseAmount } from '@/lib/utils/date'

// Simple local parser using regex heuristics. Vendor-specific modules can refine.
export class LocalReceiptParser implements IReceiptParser {
  async parse(req: ReceiptParseRequest): Promise<ReceiptParseResult> {
    const { fileUrl } = req
    const ocr = await Tesseract.recognize(fileUrl, req.locale === 'fa' ? 'fas' : 'eng')
    const raw = ocr.data?.text || ''

    // Heuristics
    const dateMatch = raw.match(/(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}|\d{4}-\d{2}-\d{2})/)
    const totalMatch = raw.match(/total\s*[:=]?\s*([£$€]?\s*[-+]?[0-9.,]+)/i)
    const vatMatch = raw.match(/vat\s*[:=]?\s*([£$€]?\s*[-+]?[0-9.,]+)/i)
    const discountMatch = raw.match(/discount\s*[:=]?\s*([£$€]?\s*[-+]?[0-9.,]+)/i)
    const pmCard = /\b(card|visa|mastercard|debit|credit)\b/i.test(raw)
    const pmCash = /\b(cash)\b/i.test(raw)
    const pmBank = /\b(bank\s*transfer|iban|sort\s*code)\b/i.test(raw)
    const currency = /£/.test(raw) ? 'GBP' : /€/.test(raw) ? 'EUR' : /\$/.test(raw) ? 'USD' : undefined

    const res: ReceiptParseResult = {
      vendor: guessVendor(raw),
      date: dateMatch?.[1],
      total: parseAmount(totalMatch?.[1] || ''),
      tax_vat: parseAmount(vatMatch?.[1] || ''),
      discount: parseAmount(discountMatch?.[1] || ''),
      payment_method: pmCard ? 'Card' : pmCash ? 'Cash' : pmBank ? 'BankTransfer' : 'Unknown',
      currency,
      line_items: undefined,
      confidence: ocr.data?.confidence || 0,
      raw_text: raw,
      image_url: fileUrl,
      meta: {}
    }
    return res
  }
}

function guessVendor(raw: string){
  if (/screwfix/i.test(raw)) return 'Screwfix'
  if (/toolstation/i.test(raw)) return 'Toolstation'
  if (/b\s*q/i.test(raw)) return 'B&Q'
  return undefined
}

export default new LocalReceiptParser()


