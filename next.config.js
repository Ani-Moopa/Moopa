/** @type {import('next').NextConfig} */
// const nextSafe = require("next-safe");

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  disable: process.env.NODE_ENV === "development",
  skipWaiting: true,
});

module.exports = withPWA({
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.*.*",
      },
      {
        protocol: "https",
        hostname: "**.**.*.*",
      },
      {
        protocol: "https",
        hostname: "simkl.in",
      },
      {
        protocol: "https",
        hostname: "tenor.com",
      },
    ],
  },
  // distDir: process.env.BUILD_DIR || ".next",
  // Uncomment this if you want to use Docker
  // output: "standalone",
  async redirects() {
    return [
      {
        source: "/donate",
        destination: "https://ko-fi.com/factiven",
        permanent: false,
        basePath: false,
      },
    ];
  },
  // async headers() {
  //   return [
  //     {
  //       // matching all API routes
  //       source: "/api/:path*",
  //       headers: [
  //         { key: "Access-Control-Allow-Credentials", value: "true" },
  //         {
  //           key: "Access-Control-Allow-Origin",
  //           value: "https://moopa.live",
  //         }, // replace this your actual origin
  //         {
  //           key: "Access-Control-Allow-Methods",
  //           value: "GET,DELETE,PATCH,POST,PUT",
  //         },
  //         {
  //           key: "Access-Control-Allow-Headers",
  //           value:
  //             "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  //         },
  //       ],
  //     },
  // {
  //   source: "/:path*",
  //   headers: nextSafe({
  //     contentTypeOptions: "nosniff",
  //     contentSecurityPolicy: {
  //       "base-uri": "'none'",
  //       "child-src": "'none'",
  //       "connect-src": [
  //         "'self'",
  //         "webpack://*",
  //         "https://graphql.anilist.co/",
  //         "https://api.aniskip.com/",
  //         "https://m3u8proxy.moopa.workers.dev/",
  //       ],
  //       "default-src": "'self'",
  //       "font-src": [
  //         "'self'",
  //         "https://cdnjs.cloudflare.com/",
  //         "https://fonts.gstatic.com/",
  //       ],
  //       "form-action": "'self'",
  //       "frame-ancestors": "'none'",
  //       "frame-src": "'none'",
  //       "img-src": [
  //         "'self'",
  //         "https://s4.anilist.co",
  //         "data:",
  //         "https://media.kitsu.io",
  //         "https://artworks.thetvdb.com",
  //         "https://img.moopa.live",
  //         "https://meo.comick.pictures",
  //         "https://kitsu-production-media.s3.us-west-002.backblazeb2.com",
  //       ],
  //       "manifest-src": "'self'",
  //       "media-src": ["'self'", "blob:"],
  //       "object-src": "'none'",
  //       "prefetch-src": false,
  //       "script-src": [
  //         "'self'",
  //         "https://static.cloudflareinsights.com",
  //         "'unsafe-inline'",
  //         "'unsafe-eval'",
  //       ],

  //       "style-src": [
  //         "'self'",
  //         "'unsafe-inline'",
  //         "https://cdnjs.cloudflare.com",
  //         "https://fonts.googleapis.com",
  //       ],
  //       "worker-src": "'self'",
  //       mergeDefaultDirectives: false,
  //       reportOnly: false,
  //     },
  //     frameOptions: "DENY",
  //     permissionsPolicy: false,
  //     // permissionsPolicyDirectiveSupport: ["proposed", "standard"],
  //     isDev: false,
  //     referrerPolicy: "no-referrer",
  //     xssProtection: "1; mode=block",
  //   }),
  // },
  //   ];
  // },
});
