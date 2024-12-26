const express = require("express");
const multer = require("multer");
const { PrismaClient } = require("@prisma/client"); // Assuming Prisma Client is set up
const { sellerAuth, authMiddleware } = require("../middlewares/authMiddleware");
const {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const prisma = new PrismaClient();
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const suffix = Date.now();
    cb(null, suffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Add product with multiple images
router.post(
  "/addProduct",
  authMiddleware,
  sellerAuth,
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "additionalImages", maxCount: 5 },
  ]),
  addProduct
);

// router.post(
//   "/addProduct",
//   authMiddleware,
//   sellerAuth,
//   upload.single("mainImage"),
//   async (req, res) => {
//     try {
//       if (!req.file) {
//         return res
//           .status(400)
//           .json({ success: false, message: "Image required" });
//       }

//       const mainImagePath = req.file.path;
//       const { name, description, price, stock, sellerId } = req.body;

//       if (!name || !description || !price || !stock || !sellerId) {
//         return res
//           .status(400)
//           .json({ success: false, message: "All fields required" });
//       }

//       const product = await prisma.product.create({
//         data: {
//           name,
//           description,
//           price: parseFloat(price),
//           stock: parseInt(stock),
//           sellerId,
//           mainImage: mainImagePath,
//           additionalImages: [],
//         },
//       });

//       res.status(201).json({ success: true, product });
//     } catch (error) {
//       res.status(500).json({ success: false, error: error.message });
//     }
//   }
// );

/* router.post("/addProduct", upload.single("mainImage"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Image required" });
    }

    const mainImagePath = req.file.path;
    const { name, description, price, stock, sellerId } = req.body;

    if (!name || !description || !price || !stock || !sellerId) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        sellerId,
        mainImage: mainImagePath,
        additionalImages: [],
      },
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}); */

// Get all products
router.get("/", getAllProducts);

// Get Product by ID
router.get("/:id", getProductById);

// Update Product
router.put(
  "/:id",
  authMiddleware,
  sellerAuth,
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "additionalImages", maxCount: 5 },
  ]),
  updateProduct
);

// Delete Product
router.delete("/:id", authMiddleware, sellerAuth, deleteProduct);

module.exports = router;
