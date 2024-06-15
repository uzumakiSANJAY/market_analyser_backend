const express = require("express");
const app = express();
const { env } = require("./lib/config/server");

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(env.API_PORT, () => {
  console.log(`Server start at ${env.API_PORT}`);
});
