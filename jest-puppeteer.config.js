module.exports = {
  server: {
    command: "PORT=9090 npm run server",
    port: 9090,
  },
  launch: {
    headless: !!process.env.CI,
  },
};
