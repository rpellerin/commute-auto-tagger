module.exports = (api) => ({
  presets: [
    [
      "@babel/preset-env",
      api.env("test")
        ? { targets: { node: "current" } }
        : { modules: false, useBuiltIns: "entry", corejs: { version: 3.8 } },
    ],
    [
      "@babel/preset-react",
      {
        runtime: "automatic",
        development:
          process.env.NODE_ENV !== "production" &&
          process.env.NODE_ENV !== "test",
      },
    ],
  ],
});
