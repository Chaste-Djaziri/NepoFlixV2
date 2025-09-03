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
    remotePatterns: [
      // MyAnimeList / Jikan images
      { protocol: "https", hostname: "cdn.myanimelist.net" },

      // (Optional) other anime sources you might hit later
      { protocol: "https", hostname: "i.ytimg.com" },          // trailers thumbnails
      { protocol: "https", hostname: "s4.anilist.co" },        // anilist images (if you add it)
      { protocol: "https", hostname: "media.kitsu.io" },       // kitsu images (if you add it)
      { protocol: "https", hostname: "img.youtube.com" }       // alt trailer thumbs
    ],
  }
};

const pwa = withPWA(nextConfig);

export default pwa;
