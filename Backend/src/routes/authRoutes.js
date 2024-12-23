const express = require("express");
const { register, login } = require("../controllers/authController");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const suffix = Date.now();
    cb(null, suffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/uploadSingleImage", upload.single("avatar"), (req, res) => {
  res.send("Single file uploaded successfully");
});

router.post("/register", register);
router.post("/login", login);

module.exports = router;
