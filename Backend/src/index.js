const express = require("express");
require("dotenv").config();

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/test", (req, res) => {
  res.send("Hello Test");
});

const PORT = process.env.PORT;

console.log("Port: " + PORT);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

module.exports = app;
