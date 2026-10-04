/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/interactive',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
