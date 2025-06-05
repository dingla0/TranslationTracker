/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@neondatabase/serverless']
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    AZURE_TRANSLATOR_ENDPOINT: process.env.AZURE_TRANSLATOR_ENDPOINT,
    AZURE_TRANSLATOR_KEY: process.env.AZURE_TRANSLATOR_KEY,
    AZURE_TRANSLATOR_REGION: process.env.AZURE_TRANSLATOR_REGION,
  }
}

module.exports = nextConfig