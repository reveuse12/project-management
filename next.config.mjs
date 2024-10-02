/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pinimg.com",
        port: "443",
        pathname: "/image/upload/",
      },
    ],
  },
};

export default nextConfig;
