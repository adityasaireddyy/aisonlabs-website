import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The dev indicator sits on top of the admin sidebar and the back-to-top button.
  devIndicators: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
