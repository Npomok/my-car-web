'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay, EffectCoverflow } from 'swiper/modules';

// Import CSS ของ Swiper (สำคัญมาก ถ้าไม่มีบรรทัดพวกนี้ รูปจะเรียงลงมาเป็นตับ)
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';

interface CarGalleryProps {
  images: string[];
}

export default function CarGallery({ images }: CarGalleryProps) {
  // ✅ ระบบกันเหนียว: ถ้าไม่มีรูปส่งมา หรือรูปหาไม่เจอ ให้ใช้รูป Logo แทน (แก้ชื่อรูปตรงนี้ให้ตรงกับในเครื่องพี่นะ)
  const defaultImages = ['/images/logomd.png', '/images/logomd.png', '/images/logomd.png'];
  
  // ถ้า images ว่างเปล่า ให้ใช้ defaultImages แทน
  const galleryImages = (images && images.length > 0) ? images : defaultImages;

  return (
    <div className="w-full py-8 bg-gray-50">
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        loop={true} // ให้หมุนวนลูป
        slidesPerView={'auto'}
        speed={1000} // ความเร็วตอนเลื่อน
        autoplay={{
          delay: 2000, // หยุดโชว์ 2 วิ แล้วไปต่อ
          disableOnInteraction: false, // เอามือจับแล้วก็ห้ามหยุดหมุน
        }}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
          slideShadows: true,
        }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
        className="mySwiper w-full h-[300px] md:h-[450px]"
      >
        {galleryImages.map((img, index) => (
          <SwiperSlide key={index} className="!w-[300px] !h-[300px] md:!w-[600px] md:!h-[400px]">
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              <Image
                src={img}
                alt={`Car image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* 👇 ตัวช่วย Debug: ถ้าเห็นข้อความนี้ แสดงว่าไฟล์นี้ทำงานแล้ว */}
      <p className="text-center text-red-500 font-bold mt-4">
        ถ้าเห็นข้อความนี้ แปลว่า CarGallery ทำงานแล้ว! (จำนวนรูป: {galleryImages.length})
      </p>
    </div>
  );
}