'use client'
import { useState } from 'react'

export default function ReceiptUpload(){
  const [imageUrl, setImageUrl] = useState<string>('')
  const [raw, setRaw] = useState('')
  const [parsed, setParsed] = useState<any>(null)
  const [busy, setBusy] = useState(false)

  async function handleFile(file: File){
    const fd = new FormData()
    fd.append('file', file)
    setBusy(true)
    const up = await fetch('/api/upload', { method:'POST', body: fd })
    if (!up.ok){ setBusy(false); return }
    const { url } = await up.json()
    setImageUrl(url)
    const ocr = await fetch('/api/ocr', { method:'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ fileUrl: url, locale:'en' }) })
    const result = await ocr.json()
    setRaw(result.raw_text || '')
    setParsed(result)
    setBusy(false)
  }

  return (
    <div className="space-y-4">
      <div className="rounded border p-4">
        <div className="flex items-center gap-3">
          <input type="file" accept="image/*" onChange={(e)=>{ const f=e.target.files?.[0]; if (f) handleFile(f) }} />
          <button className="rounded bg-black px-3 py-2 text-white disabled:opacity-50" disabled={busy} onClick={async()=>{
            const input = document.createElement('input');
            input.type = 'file'; input.accept = 'image/*'; input.capture = 'environment';
            input.onchange = ()=>{ const f = (input.files?.[0]); if (f) handleFile(f) }
            input.click();
          }}>Use camera</button>
        </div>
      </div>
      {imageUrl && (
        <div className="grid gap-4 sm:grid-cols-2">
          <img src={imageUrl} alt="receipt" className="w-full rounded border" />
          <div className="space-y-2">
            <h3 className="font-semibold">Parsed</h3>
            <pre className="max-h-[360px] overflow-auto whitespace-pre-wrap rounded border bg-slate-50 p-2 text-sm">{JSON.stringify(parsed, null, 2)}</pre>
            <h3 className="font-semibold">Raw text</h3>
            <pre className="max-h-[360px] overflow-auto whitespace-pre-wrap rounded border bg-slate-50 p-2 text-sm">{raw}</pre>
          </div>
        </div>
      )}
    </div>
  )
}


