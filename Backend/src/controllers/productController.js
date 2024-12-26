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

exports.getAllProducts = async (req, res) => {
  try {
    // Extract pagination parameters from the query
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

    // Calculate skip value
    const skip = (page - 1) * limit;

    // Query for the total count of products
    const totalProducts = await prisma.product.count();

    // Query for paginated products
    const products = await prisma.product.findMany({
      skip,
      take: limit,
    });

    // Return the data
    res.json({
      success: true,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      products,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    // Debug logs
    console.log("Files:", req.files);
    console.log("Body raw:", req.body);
    console.log("Params id:", req.params.id);

    // Validate the product exists
    const product = await prisma.product.findUnique({
      where: { id: req.params.id }, // Use the string directly
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Validate that the user is authorized to update this product
    if (product.sellerId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this product" });
    }

    // Prepare update data
    const updateData = { ...req.body };

    // Handle files if provided
    if (req.files?.mainImage?.[0]?.path) {
      updateData.mainImage = req.files.mainImage[0].path;
    }

    if (req.files?.additionalImages?.length > 0) {
      updateData.additionalImages = req.files.additionalImages.map(
        file => file.path
      );
    }

    // Validate and parse numeric fields if provided
    if (updateData.price) {
      const parsedPrice = parseFloat(updateData.price);
      if (isNaN(parsedPrice)) {
        return res.status(400).json({ error: "Invalid price value" });
      }
      updateData.price = parsedPrice;
    }

    if (updateData.stock) {
      const parsedStock = parseInt(updateData.stock, 10);
      if (isNaN(parsedStock)) {
        return res.status(400).json({ error: "Invalid stock value" });
      }
      updateData.stock = parsedStock;
    }

    // Update the product in the database
    const updatedProduct = await prisma.product.update({
      where: { id: req.params.id }, // No parsing necessary, id is a string
      data: updateData,
    });

    // Respond with the updated product
    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (req.user.role !== "SELLER") {
      return res.status(403).json({ error: "Not authorized" });
    }

    await prisma.product.delete({
      where: { id: req.params.id },
    });

    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
