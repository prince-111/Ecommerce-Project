const express = require("express");
require("dotenv").config();
const authRoutes = require("./src/routes/authRoutes");
const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());

app.use("/users", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/test", (req, res) => {
  res.send("Hello Test");
});

console.log("Port: " + PORT);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

module.exports = app;
