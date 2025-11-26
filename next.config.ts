/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // อนุญาตให้โหลดรูปจากทุกเว็บ (รวมถึง Supabase)
      },
    ],
  },
};

export default nextConfig;