import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'N8N Workflow Browser',
  description: '2,300+ ready-to-import N8N automation workflows',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#05050a] text-slate-200 antialiased">
        {children}
      </body>
    </html>
  )
}
