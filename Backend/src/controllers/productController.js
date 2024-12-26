const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.addProduct = async (req, res) => {
  try {
    // Debug logs
    console.log("Files:", req.files);
    console.log("Body raw:", req.body);

    // Validate all required fields
    const mainImagePath = req.files?.mainImage?.[0]?.path;

    const additionalImagePaths =
      req.files?.additionalImages?.map(file => file.path) || [];

    // Check if all required fields are present
    if (
      !req.body.name ||
      !req.body.price ||
      !req.body.stock ||
      !req.body.categoryId
    ) {
      return res.status(400).json({
        error: "Missing required fields",
        received: req.body,
      });
    }

    if (!mainImagePath && !additionalImagePaths) {
      return res.status(400).json({ error: "Main image required" });
    }

    // Create the product
    const product = await prisma.product.create({
      data: {
        name: req.body.name,
        description: req.body.description || "",
        price: parseFloat(req.body.price),
        stock: parseInt(req.body.stock),
        sellerId: req.user.id,
        categoryId: req.body.categoryId,
        mainImage: mainImagePath,
        additionalImages: additionalImagePaths,
      },
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: error.message });
  }
};
