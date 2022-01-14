const config = {
  webServer: {
    command: "PORT=9090 npm NODE_ENV=test run server",
    port: 9090,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
};
module.exports = config;
