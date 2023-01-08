/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
  },
};

module.exports = nextConfig;
