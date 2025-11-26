import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* คอลัมน์ 1: เกี่ยวกับเรา */}
          <div>
            <h3 className="text-2xl font-bold mb-4">MD เกษตรยนต์</h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              ศูนย์รวมรถดั๊ม
            </p>
            
          </div>

          {/* คอลัมน์ 2: เมนูลัด */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-gray-200">เมนูลัด</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/" className="hover:text-white transition">หน้าแรก</Link></li>
              <li><Link href="/" className="hover:text-white transition">รถทั้งหมด</Link></li>
              <li><Link href="/admin" className="hover:text-white transition">สำหรับผู้ดูแล (Admin)</Link></li>
            </ul>
          </div>

          {/* คอลัมน์ 3: ติดต่อเรา */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-gray-200">ติดต่อเรา</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start">
                <span className="mr-3 text-xl">📍</span>
                <span>คีรีมาศ<br/>ตำบลสามพวง</span>
              </li>
              <li className="flex items-center">
                <span className="mr-3 text-xl">📞</span>
                <span className="text-white font-bold text-lg">094-709-0666</span>
              </li>
              <li className="flex items-center">
                <span className="mr-3 text-xl">💬</span>
                <span>Line ID: 0946172282</span>
              </li>
            </ul>
          </div>

        </div>

        {/* เส้นขีดคั่น */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} MD เกษตรยนต์. สงวนลิขสิทธิ์.</p>
        </div>
      </div>
    </footer>
  );
}