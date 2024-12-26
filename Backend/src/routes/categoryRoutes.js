const express = require("express");
const {
  addCategory,
  getAllCategory,
  deleteCategory,
  getProductsByCategory,
} = require("../controllers/categoryController");

const router = express.Router();

router.get("/", getAllCategory);
router.post("/addCategory", addCategory);
router.delete("/:id", deleteCategory);
// Get Products by Category
router.get("/:categoryId", getProductsByCategory);

module.exports = router;
