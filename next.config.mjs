/** @type {import('next').NextConfig} */
const nextConfig = {
  //output: 'export',

  env: {
    auth_token: '96e4706989fd7831006c78bff9dd15a2',
    auth_account_id: 'AC32b9e616e46447da77e5ef05c2d5482c'
  },
  reactStrictMode: false,
  experimental: { appDir: true, serverComponentsExternalPackages: ["mongoose"] },
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    config.resolve.fallback = { ...config.resolve.fallback, net: false, os: false, tls: false, fs: false };

    return config;
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cloudflare-ipfs.com',

      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'loremflickr.com'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com'
      }
    ],
  },
};



export default nextConfig;
