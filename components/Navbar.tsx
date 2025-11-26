import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
         {/* เริ่มต้นส่วนโลโก้และชื่อ */}
    <Link href="/" className="flex items-center gap-2 group">
      {/* 1. ส่วนรููปโลโก้ */}
      <div className="relative w-10 h-10 flex-shrink-0 transition-transform group-hover:scale-110">
        <Image
            src="logomd.jpg"  // <-- ตรวจสอบให้แน่ใจว่าชื่อไฟล์ตรงกัน
            alt="MD Kaset Yon Logo"
            fill
            className="object-contain"
            priority
        />
      </div>

      {/* 2. ส่วนข้อความที่ปรับแต่งใหม่ */}
      <span className="font-extrabold text-2xl tracking-tight text-gray-900 dark:text-white transition-colors group-hover:text-blue-600">
        MDเกษตรยนต์
      </span>
    </Link>
    {/* สิ้นสุดส่วนโลโก้และชื่อ */}

          {/* เมนูขวา: เน้นช่องทางติดต่อ */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-red-600 font-medium transition">
              รถทั้งหมด
            </Link>
            <Link href="#contact" className="text-gray-600 hover:text-red-600 font-medium transition">
              ติดต่อเรา
            </Link>
            {/* ปุ่มเบอร์โทรเด่นๆ */}
            <a href="tel:0900317698" className="bg-black text-white px-5 py-2 rounded-full font-medium hover:bg-gray-800 transition flex items-center gap-2">
              <span>📞 โทรสอบถาม</span>
            </a>
          </div>

        </div>
      </div>
    </nav>
  );
}