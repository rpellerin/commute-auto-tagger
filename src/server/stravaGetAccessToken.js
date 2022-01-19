const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const httpsOptions = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

const post = async (url, body) =>
  new Promise((resolve, reject) => {
    const req = https.request(url, httpsOptions, (res) => {
      if (res.statusCode < 200 || res.statusCode > 299) {
        return reject(new Error(`HTTP status code ${res.statusCode}`));
      }

      const body = [];
      res.on("data", (chunk) => body.push(chunk));
      res.on("end", () => {
        const resString = Buffer.concat(body).toString();
        resolve(resString);
      });
    });

    req.on("error", (err) => reject(err));

    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request time out"));
    });

    req.write(JSON.stringify(body));
    req.end();
  });

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());

if (process.env.NODE_ENV === "development") {
  const webpackDevMiddleware = require("webpack-dev-middleware");
  const webpack = require("webpack");
  const webpackConfig = require("react-scripts/config/webpack.config");
  const webpackHotMiddleware = require("webpack-hot-middleware");

  const webpackConfigObject = webpackConfig("development");
  webpackConfigObject.plugins.push(new webpack.HotModuleReplacementPlugin());
  webpackConfigObject.entry = [
    "webpack-hot-middleware/client",
    webpackConfigObject.entry,
  ];
  const compiler = webpack(webpackConfigObject);
  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: webpackConfigObject.output.publicPath,
    })
  );
  app.use(webpackHotMiddleware(compiler));
} else {
  app.use(express.static("build"));
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const client_secret = process.env.CLIENT_SECRET;

app.post("/strava-get-access-token", async (req, res) => {
  try {
    const responseFromStrava = await post(
      "https://www.strava.com/api/v3/oauth/token",
      { ...req.body, client_secret }
    );
    res.send(responseFromStrava);
  } catch (e) {
    res.send(`Error: ${e.message}`);
  }
});

if (process.env.NODE_ENV !== "production") {
  app.use((_req, res) => {
    res
      .status(404)
      .send("Have you run `REACT_APP_CLIENT_ID=123 npm run build`?");
  });
}
