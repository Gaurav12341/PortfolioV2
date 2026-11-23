import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Lets a production build run beside `next dev` without sharing .next (e.g. NEXT_DIST_DIR=.next-build). */
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
