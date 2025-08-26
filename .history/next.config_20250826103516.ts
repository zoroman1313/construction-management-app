import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Exclude the modules/accounting directory from the build
    outputFileTracingExcludes: {
      '*': [
        'src/modules/accounting/**/*',
      ],
    },
  },
  webpack: (config, { isServer }) => {
    // Exclude the modules/accounting directory from webpack processing
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        ...(config.watchOptions.ignored || []),
        '**/src/modules/accounting/**/*',
      ],
    };
    
    return config;
  },
};

export default nextConfig;
