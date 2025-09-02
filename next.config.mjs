/** @type {import('next').NextConfig} */

import withPWAInit from "@ducanh2912/next-pwa";
import { hostname } from "os";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  disable: process.env.NODE_ENV === "development",
  reloadOnOnline: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  workboxOptions: {
    disableDevLogs: true
  }
});

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false
  },
  images: {
    domains: ["image.tmdb.org"],
  }
};

const pwa = withPWA(nextConfig);

export default pwa;
