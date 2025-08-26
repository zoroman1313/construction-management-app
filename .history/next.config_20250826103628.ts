import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingExcludes: {
    '*': [
      'src/modules/accounting/**/*',
    ],
  },
  webpack: (config, { isServer }) => {
    // Exclude the modules/accounting directory from webpack processing
    if (config.watchOptions && config.watchOptions.ignored) {
      config.watchOptions.ignored = [
        ...config.watchOptions.ignored,
        '**/src/modules/accounting/**/*',
      ];
    } else {
      config.watchOptions = {
        ignored: ['**/src/modules/accounting/**/*'],
      };
    }
    
    return config;
  },
};

export default nextConfig;
