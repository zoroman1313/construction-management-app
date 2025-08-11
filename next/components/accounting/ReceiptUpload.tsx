'use client'
import { useState } from 'react'
import Tesseract from 'tesseract.js'

export default function ReceiptUpload(){
  const [file, setFile] = useState<File|null>(null)
  const [preview, setPreview] = useState('')
  const [rawText, setRawText] = useState('')
  const [parsed, setParsed] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>){
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setLoading(true)
    try {
      const { data } = await Tesseract.recognize(f, 'eng')
      setRawText(data.text || '')
      const fd = new FormData(); fd.append('file', f)
      const up = await fetch('/api/upload', { method:'POST', body: fd })
      const { url } = await up.json()
      const res = await fetch('/api/ocr', { method:'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ fileUrl: url, locale:'en', raw_text: data.text }) })
      const json = await res.json()
      setParsed(json)
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" capture="environment" onChange={onFileChange} />
      {preview && <img src={preview} alt="preview" className="max-w-sm rounded" />}
      {loading && <div>Processing…</div>}
      {rawText && <textarea className="w-full h-40 p-2 border" defaultValue={rawText} />}
      {parsed && (
        <div className="p-3 border rounded">
          <div>Vendor: {parsed.vendor || '-'}</div>
          <div>Date: {parsed.date || '-'}</div>
          <div>Total: {parsed.total ?? '-'}</div>
          <div>VAT: {parsed.tax_vat ?? '-'}</div>
          <div>Discount: {parsed.discount ?? '-'}</div>
          <div>Method: {parsed.payment_method || '-'}</div>
          <button className="px-3 py-2 border rounded mt-2" onClick={async ()=>{
            const payload = {
              userId: 'demo-user',
              category: 'Material',
              vendor: parsed.vendor || '',
              amount: parsed.total ?? 0,
              currency: parsed.currency || 'GBP',
              paymentMethod: parsed.payment_method || 'Unknown',
              bank: parsed.bank || null,
              vat: parsed.tax_vat ?? 0,
              discount: parsed.discount ?? 0,
              items: parsed.line_items || [],
              expenseAt: parsed.date ? new Date(parsed.date) : new Date(),
              receiptImageUrl: parsed.image_url || '',
              rawText: parsed.raw_text || '',
              confidence: parsed.confidence ?? 0.5,
              note: ''
            }
            await fetch('/api/expenses', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
            alert('Expense saved')
          }}>Save as Expense</button>
        </div>
      )}
    </div>
  )
}


