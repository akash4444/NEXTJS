/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: "/api/pinCode/:pincode",
        destination: "http://www.postalpincode.in/api/pincode/:pincode",
      },
    ];
  },
};

export default nextConfig;
