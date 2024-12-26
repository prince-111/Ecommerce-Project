const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Name required" });
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
      },
    });

    res.status(201).json({ success: true, category });
    console.log(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Create Category Error", error);
  }
};

exports.getAllCategory = async (req, res) => {
  try {
    const category = await prisma.category.findMany();
    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await prisma.category.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true, message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { categoryId: req.params.categoryId },
    });

    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
