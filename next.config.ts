import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to THIS project. A stray package-lock.json in a
  // parent directory made Turbopack infer C:\Users\surya as the root, which
  // broke dev file-watching (stale CSS, HMR not recovering from errors).
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
