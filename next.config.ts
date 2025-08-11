import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval';
              worker-src 'self' blob:;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data:;
              connect-src 'self';
              font-src 'self';
            `.replace(/\n/g, '').replace(/\s+/g, ' ').trim(),
          },
        ],
      },
    ];
  },
};

const sentryWebpackPluginOptions = {
  org: "ssd-vs",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  disableLogger: true,
  automaticVercelMonitors: true,
};

export default withSentryConfig(nextConfig, sentryWebpackPluginOptions);
