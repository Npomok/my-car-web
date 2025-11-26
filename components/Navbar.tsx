import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* โลโก้ร้านคุณ */}
          <Link href="/">
            <span className="text-2xl font-bold text-gray-900 tracking-wide">
              MD<span className="text-green-800"> เกษตรยนต์</span>
            </span>
          </Link>

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