module.exports = {
  server: {
    command: "PORT=9090 npm run server",
  },
  launch: {
    headless: !!process.env.CI,
  },
};
