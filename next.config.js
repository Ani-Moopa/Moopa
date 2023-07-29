/** @type {import('next').NextConfig} */
const { createSecureHeaders } = require("next-secure-headers");

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
  trailingSlash: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: createSecureHeaders({
          contentSecurityPolicy: {
            directives: {
              styleSrc: [
                "'self'",
                "'unsafe-inline'",
                "https://cdnjs.cloudflare.com",
                "https://fonts.googleapis.com",
              ],
              imgSrc: [
                "'self'",
                "https://s4.anilist.co",
                "data:",
                "https://media.kitsu.io",
                "https://artworks.thetvdb.com",
              ],
              baseUri: "self",
              formAction: "self",
              frameAncestors: true,
            },
          },
        }),
      },
    ];
  },
});
