module.exports = {
  server: {
    command: "npm run server",
    port: 3001,
  },
  launch: {
    headless: !!process.env.CI,
  },
};
