/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
    OWNER: process.env.OWNER,
  },
};

module.exports = nextConfig;
