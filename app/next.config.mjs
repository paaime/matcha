/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tailwindui.com',
        port: '',
        // pathname: '/img',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        // pathname: '/img',
      },
    ],
  },
};

export default nextConfig;
