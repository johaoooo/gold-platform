import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['nonbigotedly-cheatable-avril.ngrok-free.dev'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dzxesa3wi/**',
      },
    ],
  },
};

export default nextConfig;
