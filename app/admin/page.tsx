'use client'
import { useState, useEffect } from 'react' // 1. ต้องมี useEffect
import { supabase } from '@/lib/supabaseClient'
import Image from 'next/image'
import { useRouter } from 'next/navigation' // 2. ต้องมี useRouter

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // ตัวแปรสำหรับฟอร์มลงขาย
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: '', price: '', year: '', mileage: '', description: ''
  })

  // ตัวแปรสำหรับรายการรถ (เอาไว้โชว์เพื่อกดลบ)
  const [cars, setCars] = useState<any[]>([])

  // -------------------------------------------------------
  // 🛡️ ยามเฝ้าประตู (ตรวจสอบ Login + โหลดข้อมูลรถ)
  // -------------------------------------------------------
  useEffect(() => {
    const initPage = async () => {
      // 1. เช็คว่าล็อกอินหรือยัง?
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login') // ถ้ายัง ดีดออกไปหน้า Login
        return
      }

      // 2. ถ้าล็อกอินแล้ว ให้ดึงข้อมูลรถมาโชว์
      fetchCars()
    }

    initPage()
  }, [router])

  // ฟังก์ชันดึงรูปรถทั้งหมด
  const fetchCars = async () => {
    const { data } = await supabase.from('cars').select('*').order('created_at', { ascending: false })
    if (data) setCars(data)
  }

  // ฟังก์ชันลบรถ
  const handleDelete = async (id: number) => {
    if (!confirm('ยืนยันที่จะลบประกาศนี้? (ลบแล้วกู้คืนไม่ได้นะครับ)')) return

    try {
      const { error } = await supabase.from('cars').delete().eq('id', id)
      if (error) throw error
      
      alert('ลบข้อมูลเรียบร้อยแล้วครับ')
      fetchCars() // โหลดรายการใหม่ทันที
    } catch (error: any) {
      alert('เกิดข้อผิดพลาด: ' + error.message)
    }
  }
  // -------------------------------------------------------

  // ฟังก์ชันเลือกรูป (หลายรูป)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setImageFiles((prev) => [...prev, ...newFiles])
      const newPreviews = newFiles.map(file => URL.createObjectURL(file))
      setPreviewUrls((prev) => [...prev, ...newPreviews])
    }
  }

  // ฟังก์ชันลบรูปตัวอย่าง
  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  // ฟังก์ชันกดลงขาย (Submit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (imageFiles.length === 0) return alert('กรุณาเลือกรูปภาพอย่างน้อย 1 รูปครับ')
    
    setLoading(true)
    try {
      const uploadedUrls: string[] = []

      // วนลูปอัปโหลดรูป
      for (const file of imageFiles) {
        const fileName = `${Date.now()}-${file.name}`
        const { error: uploadError } = await supabase.storage
          .from('car-images')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        const { data: publicUrlData } = supabase.storage
          .from('car-images')
          .getPublicUrl(fileName)
        
        uploadedUrls.push(publicUrlData.publicUrl)
      }

      // บันทึกข้อมูล
      const { error: insertError } = await supabase
        .from('cars')
        .insert([
          { ...formData, images: uploadedUrls }
        ])

      if (insertError) throw insertError

      alert('✅ ลงขายรถสำเร็จเรียบร้อย!')
      
      // ล้างค่าฟอร์ม
      setFormData({ name: '', price: '', year: '', mileage: '', description: '' })
      setImageFiles([])
      setPreviewUrls([])
      
      // อัปเดตรายการรถด้านล่างด้วย
      fetchCars()

    } catch (error: any) {
      alert('❌ เกิดข้อผิดพลาด: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* กล่องที่ 1: ฟอร์มลงขาย */}
        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">🚗 ลงขายรถใหม่</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative mb-4">
                <input type="file" accept="image/*" multiple onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="text-center">
                  <span className="text-4xl">📷</span>
                  <p className="mt-2 text-sm text-gray-600">คลิกเพื่อเพิ่มรูป (เลือกได้หลายรูป)</p>
                </div>
              </label>

              {previewUrls.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative h-24 rounded-lg overflow-hidden group">
                      <Image src={url} alt="preview" fill className="object-cover" />
                      <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition">X</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <input type="text" placeholder="ชื่อรุ่นรถ" required className="border p-3 rounded-lg text-black bg-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                 <input type="text" placeholder="ราคา" required className="border p-3 rounded-lg text-black bg-white" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                 <input type="text" placeholder="ปี" required className="border p-3 rounded-lg text-black bg-white" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} />
              </div>
              <input type="text" placeholder="เลขไมล์" required className="border p-3 rounded-lg text-black bg-white" value={formData.mileage} onChange={e => setFormData({...formData, mileage: e.target.value})} />
              <textarea placeholder="รายละเอียดเพิ่มเติม" rows={3} className="border p-3 rounded-lg text-black bg-white" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>

            <button type="submit" disabled={loading} className={`w-full py-3 rounded-lg text-white font-bold transition ${loading ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'}`}>
              {loading ? 'กำลังบันทึก...' : '✅ ลงขายทันที'}
            </button>
          </form>
        </div>

        {/* กล่องที่ 2: รายการรถที่มีอยู่ (เอาไว้ลบ) */}
        // ... (ส่วนบนเหมือนเดิม) ...

{/* กล่องที่ 2: รายการรถที่มีอยู่ */}
<div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
   <div className="flex justify-between items-center mb-6 border-b pb-4">
     <h2 className="text-2xl font-bold text-gray-900">📋 จัดการสต็อกรถ ({cars.length} คัน)</h2>
     <button onClick={async () => { await supabase.auth.signOut(); router.push('/login'); }} className="text-red-600 font-bold hover:underline text-sm">
       ออกจากระบบ
     </button>
   </div>
   
   <div className="space-y-4">
     {cars.map((car) => (
       <div key={car.id} className="flex items-center justify-between border p-4 rounded-lg hover:bg-gray-50">
         <div className="flex items-center space-x-4">
           <div className="relative w-24 h-16 bg-gray-200 rounded overflow-hidden">
             {car.images && car.images[0] ? (
               <Image src={car.images[0]} alt={car.name} fill className="object-cover" />
             ) : (
               <div className="flex items-center justify-center h-full text-xs text-gray-400">No Image</div>
             )}
           </div>
           <div>
             <h3 className="font-bold text-black">{car.name}</h3>
             <p className="text-sm text-gray-600">{car.price} บาท • ปี {car.year}</p>
           </div>
         </div>
         
         <div className="flex space-x-2">
           {/* 🟡 ปุ่มแก้ไข (เพิ่มใหม่) */}
           <button 
             onClick={() => router.push(`/admin/edit/${car.id}`)}
             className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg hover:bg-yellow-500 hover:text-white transition text-sm font-bold"
           >
             แก้ไข
           </button>

           {/* 🔴 ปุ่มลบ (ของเดิม) */}
           <button 
             onClick={() => handleDelete(car.id)}
             className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition text-sm font-bold"
           >
             ลบ
           </button>
         </div>
       </div>
     ))}
     {cars.length === 0 && <p className="text-center text-gray-500 py-4">ยังไม่มีรถในระบบ</p>}
   </div>
</div>


      </div>
    </div>
  )
}