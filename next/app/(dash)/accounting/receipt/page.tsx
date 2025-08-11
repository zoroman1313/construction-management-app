import ReceiptUpload from '@/components/accounting/ReceiptUpload'

export default function ReceiptPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Receipt OCR</h1>
      <ReceiptUpload />
    </div>
  )
}


