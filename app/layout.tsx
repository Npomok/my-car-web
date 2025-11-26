import './globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata = {
  title: 'MD เกษตรยนต์',
  description: 'ตลาดซื้อขายรถดั๊ม',
}

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="th">
      <body className="bg-gray-50">
        <Navbar />
        
        <main className="pt-20 min-h-screen">
          {children}
        </main>

        {/* ใส่ Footer ไว้ตรงนี้ครับ (ล่างสุด) */}
        <Footer />
      </body>
    </html>
  )
}