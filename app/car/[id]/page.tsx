import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

async function getCar(id: string) {
  const { data } = await supabase.from('cars').select('*').eq('id', id).single();
  return data;
}

export default async function CarDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = await getCar(id);

  if (!car) return <div className="p-20 text-center text-2xl text-black">ไม่พบข้อมูลรถคันนี้</div>;

  const hasImages = car.images && car.images.length > 0;
  const mainImage = hasImages ? car.images[0] : null;
  const galleryImages = hasImages ? car.images.slice(1) : [];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-10">
        
        {/* ปุ่มย้อนกลับ สีเข้มขึ้น */}
        <Link href="/" className="inline-flex items-center text-gray-800 hover:text-red-600 mb-6 font-bold text-lg transition">
          ← กลับไปหน้าแรก
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* รูปภาพ */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-lg bg-gray-200">
              {mainImage && (
                <Image src={mainImage} alt={car.name} fill className="object-cover" priority />
              )}
            </div>
            {galleryImages.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                 {galleryImages.map((img: string, index: number) => (
                   <div key={index} className="relative h-24 rounded-lg overflow-hidden cursor-pointer shadow-sm hover:opacity-80 border-2 border-transparent hover:border-red-500 transition">
                     <Image src={img} alt="gallery" fill className="object-cover" />
                   </div>
                 ))}
              </div>
            )}
          </div>

          {/* ข้อมูล */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24 border border-gray-200">
              <h1 className="text-3xl font-extrabold text-black mb-2">{car.name}</h1>
              <p className="text-4xl font-bold text-red-600 mb-6">{car.price} บาท</p>

              <div className="grid grid-cols-2 gap-y-4 text-base mb-6">
                {/* ปรับสีหัวข้อให้เข้ม */}
                <div className="text-gray-900 font-bold">ปีจดทะเบียน</div>
                <div className="text-black font-medium">{car.year}</div>
                
                <div className="text-gray-900 font-bold">เลขไมล์</div>
                <div className="text-black font-medium">{car.mileage}</div>
              </div>

              <hr className="border-gray-200 my-6" />
              
              <h3 className="font-bold text-lg text-black mb-3">รายละเอียดรถยนต์</h3>
              {/* รายละเอียด สีดำเทา อ่านง่าย */}
              <p className="text-gray-800 leading-relaxed whitespace-pre-line font-medium text-lg">
                {car.description}
              </p>

              <div className="mt-8 space-y-3">
                <a href="tel:0900317698" className="block w-full text-center bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition shadow-md">
                   📞 โทรสอบถาม
                </a>
                <a href="https://line.me/ti/p/_W6gW0tUAy" className="block w-full text-center bg-[#00B900] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#00a000] transition shadow-md">
                   QR Code LINE
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}