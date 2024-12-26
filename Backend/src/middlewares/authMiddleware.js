const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

//! Middleware to authenticate user
const authMiddleware = async (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "NO Token, Authorization Denied" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      console.log("This decoded user is : ", req.user);
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: "Unauthorized" });
    }
  } else {
    return res.status(401).json({ message: "No Token, Authorization Denied" });
  }
};

//! seller Authorization method
const sellerAuth = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.role !== "SELLER") {
      return res
        .status(403)
        .json({ success: false, message: "Seller access only" });
    }
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Unauthorized", error: error.message });
  }
};

//! Middleware to check stock
const checkStock = async (req, res, next) => {
  try {
    const { products } = req.body;
    for (const product of products) {
      const dbProduct = await prisma.product.findUnique({
        where: { id: product.id },
      });
      if (!product || dbProduct.stock < product.quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for product: ${product?.name || item.id}`,
        });
      }
    }
    next();
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { authMiddleware, sellerAuth, checkStock };
