module.exports = {
  server: {
    command: "PORT=9090 npm run server",
    port: 9090, // https://github.com/smooth-code/jest-puppeteer/tree/master/packages/jest-dev-server#port
  },
  launch: {
    headless: !!process.env.CI,
  },
};
