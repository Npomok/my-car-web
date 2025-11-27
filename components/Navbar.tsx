import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          {/* โลโก้และชื่อ */}
          <Link href="/" className="flex flex-row items-center gap-3 no-underline">
            <div className="relative w-16 h-16 flex-shrink-0"> {/* ✅ ขนาดโลโก้บนมือถือและคอม */}
               <Image
                  src="/images/logomd.png"
                  alt="MD Kaset Yon Logo"
                  fill
                  className="object-contain"
                  priority
               />
            </div>
            {/* ✅ ชื่อ MDเกษตรยนต์: ขนาด text-2xl บนมือถือ, text-3xl บนจอใหญ่ขึ้นไป */}
            <span className="font-black text-2xl md:text-3xl text-gray-900 whitespace-nowrap tracking-wide">
              MDเกษตรยนต์
            </span>
          </Link>

          {/* เมนูขวา: ซ่อนบนมือถือ (md:flex คือจะโชว์เมื่อหน้าจอใหญ่กว่า 768px) */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-red-600 font-medium transition">
              รถทั้งหมด
            </Link>
            <Link href="#contact" className="text-gray-600 hover:text-red-600 font-medium transition">
              ติดต่อเรา
            </Link>
            <a href="tel:0900317698" className="bg-black text-white px-5 py-2 rounded-full font-medium hover:bg-gray-800 transition flex items-center gap-2 whitespace-nowrap">
              <span>📞 โทรสอบถาม</span>
            </a>
          </div>

          {/* 📱 ปุ่ม Hamburger Menu (สำหรับมือถือ) - ถ้าพี่ต้องการ เดี๋ยวผมเพิ่มให้ทีหลังครับ */}
          {/* <div className="md:hidden">
              <button>☰</button>
          </div> */}

        </div>
      </div>
    </nav>
  );
}