import { IReceiptParser, ReceiptParseRequest, ReceiptParseResult } from './contracts'

const OCR_ENDPOINT = process.env.OCR_SERVICE_URL || 'http://localhost:8000/v1/receipt:parse'

export const parserRemote: IReceiptParser = {
  async parse(req: ReceiptParseRequest): Promise<ReceiptParseResult> {
    const absUrl = req.fileUrl.startsWith('http')
      ? req.fileUrl
      : `${process.env.PUBLIC_BASE_URL || 'http://localhost:3000'}${req.fileUrl}`
    const imgRes = await fetch(absUrl)
    if (!imgRes.ok) throw new Error('Failed to fetch image for OCR')
    const blob = await imgRes.blob()

    const form = new FormData()
    form.append('file', blob as any, 'receipt.jpg')
    form.append('projectId', (req.projectId || '') as any)
    form.append('locale', (req.locale || 'en') as any)

    const resp = await fetch(OCR_ENDPOINT, { method: 'POST', body: form as any })
    if (!resp.ok) throw new Error(`OCR remote failed: ${resp.status}`)
    const json = await resp.json()
    return {
      vendor: json.vendor,
      date: json.date,
      total: json.total,
      tax_vat: json.tax_vat,
      discount: json.discount,
      payment_method: json.payment_method,
      bank: json.bank ?? null,
      currency: json.currency || 'GBP',
      line_items: json.line_items || [],
      confidence: json.confidence ?? 0.5,
      raw_text: json.raw_text || '',
      image_url: req.fileUrl,
      meta: json.meta || {},
    }
  },
}

export default parserRemote


