const express = require("express");
const app = express();
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const suffix = Date.now();
    cb(null, suffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/uploadSingleImage", upload.single("avatar"), (req, res) => {
  res.send("Single file uploaded successfully");
  console.log("Here request from body", req.body);
  console.log("Here request from file", req.file);
});

router.post("/uploadMultipleImages", upload.array("photos", 3), (req, res) => {
  res.send("Multiple files uploaded successfully");
  console.log("Here request from body", req.body);
  console.log("Here request from file", req.files);
});

module.exports = router;
