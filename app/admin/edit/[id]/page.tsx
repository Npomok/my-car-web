// @ts-nocheck
'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation' // <--- 1. เรียกใช้ useParams

export default function EditCarPage() { // <--- 2. ไม่ต้องรับ params ตรงนี้แล้ว
  const router = useRouter()
  const params = useParams() // <--- 3. ดึงค่า params แบบนี้แทน
  const id = params?.id // ดึง id ออกมา

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  // เก็บรูปเก่า (URL String) และ รูปใหม่ (File)
  const [oldImages, setOldImages] = useState<string[]>([])
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [newPreviews, setNewPreviews] = useState<string[]>([])

  const [formData, setFormData] = useState({
    name: '', price: '', year: '', mileage: '', description: ''
  })

  // 1. โหลดข้อมูลรถเดิมมาใส่ในฟอร์ม
  useEffect(() => {
    if (!id) return; // ถ้ายังไม่มี ID ไม่ต้องทำอะไร

    const fetchCar = async () => {
      // เช็ค Login ก่อน
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      // ดึงข้อมูลรถ
      const { data, error } = await supabase.from('cars').select('*').eq('id', id).single()
      if (error) { alert('ไม่พบข้อมูลรถ'); router.push('/admin'); return }

      if (data) {
        setFormData({
          name: data.name,
          price: data.price,
          year: data.year,
          mileage: data.mileage,
          description: data.description
        })
        // ตั้งค่ารูปเก่าที่เคยมี
        if (data.images && Array.isArray(data.images)) {
          setOldImages(data.images)
        }
      }
      setFetching(false)
    }
    fetchCar()
  }, [id, router])

  // จัดการรูปใหม่ที่เพิ่มเข้ามา
  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setNewFiles(prev => [...prev, ...files])
      const previews = files.map(file => URL.createObjectURL(file))
      setNewPreviews(prev => [...prev, ...previews])
    }
  }

  // ลบรูป (แยกเป็น ลบรูปเก่า หรือ ลบรูปใหม่)
  const removeOldImage = (indexToRemove: number) => {
    setOldImages(prev => prev.filter((_, index) => index !== indexToRemove))
  }
  const removeNewImage = (indexToRemove: number) => {
    setNewFiles(prev => prev.filter((_, index) => index !== indexToRemove))
    setNewPreviews(prev => prev.filter((_, index) => index !== indexToRemove))
  }

  // บันทึกการแก้ไข
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1. อัปโหลดรูปใหม่ (ถ้ามี)
      const uploadedNewUrls: string[] = []
      for (const file of newFiles) {
        const fileName = `${Date.now()}-${file.name}`
        const { error: uploadError } = await supabase.storage.from('car-images').upload(fileName, file)
        if (uploadError) throw uploadError
        const { data } = supabase.storage.from('car-images').getPublicUrl(fileName)
        uploadedNewUrls.push(data.publicUrl)
      }

      // 2. รวมรูปเก่าที่เหลืออยู่ + รูปใหม่ที่เพิ่งอัป
      const finalImages = [...oldImages, ...uploadedNewUrls]

      // 3. สั่ง Update ข้อมูลใน Database
      const { error: updateError } = await supabase
        .from('cars')
        .update({
          ...formData,
          images: finalImages
        })
        .eq('id', id) // สำคัญ! ต้องระบุว่าจะแก้คันไหน

      if (updateError) throw updateError

      alert('✅ แก้ไขข้อมูลเรียบร้อย!')
      router.push('/admin') // กลับไปหน้า Admin

    } catch (error: any) {
      alert('เกิดข้อผิดพลาด: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="p-10 text-center">กำลังโหลดข้อมูลเดิม...</div>

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">✏️ แก้ไขข้อมูลรถ</h2>
          <button onClick={() => router.back()} className="text-gray-500 hover:text-black">ยกเลิก</button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          
          {/* ส่วนจัดการรูปภาพ */}
          <div className="space-y-4">
            <p className="font-bold text-gray-700">รูปภาพปัจจุบัน:</p>
            
            {/* แสดงรูปเก่า */}
            <div className="grid grid-cols-4 gap-4">
              {oldImages.map((url, index) => (
                <div key={`old-${index}`} className="relative h-20 rounded border-2 border-blue-100 overflow-hidden group">
                   <Image src={url} alt="old" fill className="object-cover" />
                   <button type="button" onClick={() => removeOldImage(index)} className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition">X</button>
                </div>
              ))}
            </div>

            {/* เพิ่มรูปใหม่ */}
            <div className="border-t pt-4">
               <label className="block text-sm font-bold text-gray-700 mb-2">เพิ่มรูปใหม่:</label>
               <input type="file" accept="image/*" multiple onChange={handleNewImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
               
               {newPreviews.length > 0 && (
                 <div className="grid grid-cols-4 gap-4 mt-4">
                   {newPreviews.map((url, index) => (
                     <div key={`new-${index}`} className="relative h-20 rounded border-2 border-green-100 overflow-hidden group">
                       <Image src={url} alt="new" fill className="object-cover" />
                       <button type="button" onClick={() => removeNewImage(index)} className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 flex items-center justify-center text-xs">X</button>
                     </div>
                   ))}
                 </div>
               )}
            </div>
          </div>

          {/* ช่องกรอกข้อมูล */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700">ชื่อรุ่น</label>
              <input type="text" required className="border p-3 rounded-lg w-full text-black" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-bold text-gray-700">ราคา</label>
                 <input type="text" required className="border p-3 rounded-lg w-full text-black" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
               </div>
               <div>
                 <label className="block text-sm font-bold text-gray-700">ปี</label>
                 <input type="text" required className="border p-3 rounded-lg w-full text-black" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} />
               </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">เลขไมล์</label>
              <input type="text" required className="border p-3 rounded-lg w-full text-black" value={formData.mileage} onChange={e => setFormData({...formData, mileage: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">รายละเอียด</label>
              <textarea rows={5} className="border p-3 rounded-lg w-full text-black" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
          </div>

          <button type="submit" disabled={loading} className={`w-full py-3 rounded-lg text-white font-bold transition ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {loading ? 'กำลังบันทึก...' : '💾 บันทึกการแก้ไข'}
          </button>
        </form>
      </div>
    </div>
  )
}