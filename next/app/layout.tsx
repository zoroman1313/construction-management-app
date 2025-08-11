import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Accounting',
  description: 'Contractor accounting module',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body className="min-h-screen bg-white text-slate-900">
        <div className="mx-auto max-w-5xl p-4">
          {children}
        </div>
      </body>
    </html>
  )
}


