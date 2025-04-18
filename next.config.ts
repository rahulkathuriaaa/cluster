/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    // Mock the missing module
    config.resolve.alias['@tailwindcss/postcss'] = require.resolve('./tailwindcss-fix.js');
    return config;
  },
};

module.exports = nextConfig;