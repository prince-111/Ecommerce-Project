const express = require("express");
const {
  register,
  login,
  getAllUser,
  updateUserRole,
  updateProfileImage,
} = require("../controllers/authController");
// const multer = require("multer");

const router = express.Router();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     const suffix = Date.now();
//     cb(null, suffix + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage });

// router.post("/uploadSingleImage", upload.single("avatar"), (req, res) => {
//   res.send("Single file uploaded successfully");
//   console.log("Here request from body", req.body);
//   console.log("Here request from file", req.file);
// });

router.post("/register", register);
router.post("/login", login);
router.get("/allUsers", getAllUser);
router.patch("/updateRole", updateUserRole);
router.patch("/uploadAvatar", updateProfileImage);

module.exports = router;
