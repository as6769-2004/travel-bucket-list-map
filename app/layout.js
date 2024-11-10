import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/ui/navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Travel Bucket List - Travel Booking Platform',
  description: 'Book your amazing travel packages and explore destinations worldwide',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <Navbar />
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}