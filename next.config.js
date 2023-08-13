/** @type {import('next').NextConfig} */
// const { createSecureHeaders } = require("next-secure-headers");

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  disable: process.env.NODE_ENV === "development",
});

module.exports = withPWA({
  reactStrictMode: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s4.anilist.co",
      },
    ],
  },
  // distDir: process.env.BUILD_DIR || ".next",
  trailingSlash: true,
  output: "standalone",
  async headers() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: true,
      },
      // {
      //   // matching all API routes
      //   source: "/api/:path*",
      //   headers: [
      //     { key: "Access-Control-Allow-Credentials", value: "true" },
      //     {
      //       key: "Access-Control-Allow-Origin",
      //       value: "https://madara.to",
      //     }, // replace this your actual origin
      //     {
      //       key: "Access-Control-Allow-Methods",
      //       value: "GET,DELETE,PATCH,POST,PUT",
      //     },
      //     {
      //       key: "Access-Control-Allow-Headers",
      //       value:
      //         "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
      //     },
      //   ],
      // },
      // {
      //   source: "/(.*)",
      //   headers: createSecureHeaders({
      //     contentSecurityPolicy: {
      //       directives: {
      //         styleSrc: [
      //           "'self'",
      //           "'unsafe-inline'",
      //           "https://cdnjs.cloudflare.com",
      //           "https://fonts.googleapis.com",
      //         ],
      //         imgSrc: [
      //           "'self'",
      //           "https://s4.anilist.co",
      //           "data:",
      //           "https://media.kitsu.io",
      //           "https://artworks.thetvdb.com",
      //           "https://img.moopa.live",
      //         ],
      //         baseUri: "self",
      //         formAction: "self",
      //         frameAncestors: true,
      //       },
      //     },
      //   }),
      // },
    ];
  },
});
