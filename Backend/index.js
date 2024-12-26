const express = require("express");
require("dotenv").config();
const authRoutes = require("./src/routes/authRoutes");
const imageRoutes = require("./src/routes/imageRoutes");
const productRoutes = require("./src/routes/productRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 8000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message,
  });
});

app.use("/api/v1/users", authRoutes);
app.use("/api/v1/images", imageRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/category", categoryRoutes);

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
