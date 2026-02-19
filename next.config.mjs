/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
    ],
  },
  // Desabilitar cache para desenvolvimento
  onDemandRevalidation: {
    maxDuration: 60,
  },
};

export default nextConfig;
