import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import SearchBar from '@/components/SearchBar';
export const revalidate = 0;

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const keyword = params?.q || '';

  let query = supabase
    .from('cars')
    .select('*')
    .order('created_at', { ascending: false });

  if (keyword) {
    query = query.ilike('name', `%${keyword}%`);
  }

  const { data: cars, error } = await query;

  if (error) return <div className="text-center p-10 text-red-500">{error.message}</div>

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* 1. ส่วนรูปปก (Hero Image) - เอาตัวหนังสือและฟิล์มดำออกแล้ว! */}
      <div className="relative h-[450px] w-full bg-gray-900">
        {/* รูปภาพเพียวๆ ชัดแจ๋ว */}
        <Image 
             src="/images/bg-hero.jpg"
             alt="Background" 
             fill 
             style={{ objectFit: 'cover' }} 
             priority 
        />
        {/* ไล่สีจางๆ ที่ขอบล่างนิดเดียว เพื่อให้รอยต่อเนียน (ไม่บังรถ) */}
        <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-gray-50/50 to-transparent"></div>
      </div>

      {/* 2. กล่องค้นหา (ลอยเด่นขึ้นมาด้านล่างรูป) */}
      <div className="relative z-10 -mt-20 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
          <h1 className="text-4xl font-extrabold text-black mb-2">MD เกษตรยนต์</h1>
          <p className="text-lg text-gray-600 mb-6 font-medium">รถดั๊มลานมีคุณภาพ</p>
          
          {/* ช่องค้นหาอยู่ตรงนี้ ชัดเจน สวยงาม */}
          <SearchBar />
        </div>
      </div>

      {/* 3. รายการรถ */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-black border-l-4 border-red-600 pl-4">
            {keyword ? `ผลการค้นหา: "${keyword}"` : 'รายการรถ'}
          </h2>
          {keyword && (
            <Link href="/" className="text-red-600 font-bold hover:underline">
              ล้างค่าค้นหา
            </Link>
          )}
        </div>

        {cars?.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-xl text-gray-800 font-medium">ไม่พบรถที่คุณค้นหาครับ</p>
            <Link href="/" className="text-red-600 mt-4 inline-block hover:underline font-bold">ดูรถทั้งหมด</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars?.map((car: any) => {
              const coverImage = car.images && car.images.length > 0 ? car.images[0] : null;

              return (
                <Link href={`/car/${car.id}`} key={car.id} className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 block border border-gray-200">
                  <div className="relative h-64 overflow-hidden bg-gray-200">
                    {coverImage ? (
                      <Image src={coverImage} alt={car.name} fill className="object-cover group-hover:scale-110 transition duration-500" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">ไม่มีรูปภาพ</div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-black truncate">{car.name}</h3>
                    <p className="text-gray-800 font-semibold text-sm mb-2 mt-1">
                       ปี {car.year} • {car.mileage}
                    </p>
                    <p className="text-2xl font-bold text-red-600">{car.price} บาท</p>
                    <div className="mt-4 pt-4 border-t border-gray-200 text-red-700 font-bold group-hover:translate-x-2 transition inline-block">
                      ดูรายละเอียด ➔
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}