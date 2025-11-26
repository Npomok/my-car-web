'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // ส่งอีเมล/รหัสผ่านไปตรวจกับ Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // ถ้าผ่าน ให้พาไปหน้า Admin
      alert('ยินดีต้อนรับครับ! กำลังพาไปหน้าจัดการ...')
      router.push('/admin')
      
    } catch (error: any) {
      alert('เข้าสู่ระบบไม่สำเร็จ: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-black">🔐 ผู้ดูแลระบบ (Admin)</h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">อีเมล</label>
            <input 
              type="email" 
              required
              className="w-full p-3 border rounded-lg text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">รหัสผ่าน</label>
            <input 
              type="password" 
              required
              className="w-full p-3 border rounded-lg text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition"
          >
            {loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </div>
    </div>
  )
}