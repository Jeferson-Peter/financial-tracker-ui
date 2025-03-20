/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  rewrites: async () => [
    {
      source: "/api/:path*",
      destination: "http://backend:8000/api/:path*", // Nome do contêiner do backend no Docker Compose
    },
  ],
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000, // Verifica alterações a cada 1 segundo
      aggregateTimeout: 300, // Aguarda 300ms após mudanças
    };
    return config;
  },
};

export default nextConfig;
