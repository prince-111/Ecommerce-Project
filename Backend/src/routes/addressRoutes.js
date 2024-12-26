const express = require("express");
const {
  createAddress,
  getUserAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
} = require("../controllers/addressController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// Create new address
router.post("/", authMiddleware, createAddress);

// Get all addresses for a user
router.get("/user/:userId", getUserAddresses);

// Get single address
router.get("/:id", getAddressById);

// Update address
router.put("/:id", updateAddress);

// Delete address
router.delete("/:id", deleteAddress);

module.exports = router;
