const { PORT } = require("./helpers/base");

const config = {
  webServer: {
    command: `PORT=${PORT} NODE_ENV=test npm run server`,
    port: PORT,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
};
module.exports = config;
