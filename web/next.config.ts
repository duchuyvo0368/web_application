import type { NextConfig } from "next";

const nextConfig = {
    devIndicators: false,
    images: {
        domains: ['trainning-buckets.s3.us-east-1.amazonaws.com'], // ✅ Add domain here
    },
};

module.exports = nextConfig;
