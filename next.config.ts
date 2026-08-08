import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow accessing the dev server from your local network IP
  // @ts-expect-error - new Next.js property
  allowedDevOrigins: ['192.168.206.200'],
};

export default nextConfig;
