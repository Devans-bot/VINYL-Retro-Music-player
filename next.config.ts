import type { NextConfig } from 'next';
import withSerwistInit from '@serwist/next';

const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  // Disable during dev — service worker caching blocks fast refresh
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {
  output: 'export',
  // Silence the "webpack config with Turbopack" warning — Serwist adds webpack
  // config internally; this empty turbopack object tells Next.js we're aware.
  turbopack: {},
};

export default withSerwist(nextConfig);
