'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  // ดึงค่าเก่ามาใส่ (ถ้ามี)
  const [term, setTerm] = useState(searchParams.get('q') || '')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault() // ป้องกันเว็บรีเฟรชทั้งหน้า
    
    if (term.trim()) {
      // ถ้ามีคำค้น ให้ส่งไปที่ URL /?q=คำค้น
      router.push(`/?q=${term}`)
    } else {
      // ถ้าช่องว่าง ให้กลับไปหน้าแรกปกติ
      router.push('/')
    }
  }

  return (
    <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-10">
      <div className="relative">
        <input 
          type="text" 
          placeholder="ค้นหารุ่นรถที่คุณสนใจ... ()" 
          className="w-full p-4 pl-6 rounded-full border-2 border-gray-200 focus:border-red-600 focus:outline-none shadow-sm text-gray-800 text-lg"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
        <button 
          type="submit"
          className="absolute right-2 top-2 bg-black text-white px-6 py-2 rounded-full font-bold hover:bg-gray-800 transition"
        >
          ค้นหา
        </button>
      </div>
    </form>
  )
}