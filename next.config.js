// next.config.js

module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    // Add a rule for handling HTML files
    config.module.rules.push({
      test: /\.html$/,
      use: 'html-loader',
    });

    return config;
  },
};
