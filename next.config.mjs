/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      // User-uploaded avatars served by the API
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "api" }, // inside docker network
      { protocol: "https", hostname: "api.camelify.com" },
      // Permissive fallback — tighten when image upload pipeline is locked.
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
