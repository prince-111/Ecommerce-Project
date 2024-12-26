const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Create new address
exports.createAddress = async (req, res) => {
  try {
    const { street, city, state, postalCode, country } = req.body;
    const userId = req.user.id;

    console.log("Request body:", req.body);
    // console.log("User ID:", userId);

    // Validate required fields
    if (!userId || !street || !city || !state || !postalCode || !country) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create address
    const address = await prisma.address.create({
      data: {
        userId,
        street,
        city,
        state,
        postalCode,
        country,
      },
    });

    res.status(201).json({
      success: true,
      address,
    });
  } catch (error) {
    console.error("Error creating address:", error);
    res.status(500).json({
      success: false,
      message: "Error creating address",
      error: error.message,
    });
  }
};

// exports.createAddress = async (req, res) => {
//   try {
//     const { street, city, state, zipCode, country } = req.body;

//     const userId = req.user.id;

//     console.log("Request body:", req.body);
//     console.log("User ID:", userId);

//     // Validate required fields
//     if (!userId || !street || !city || !state || !zipCode || !country) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }

//     // Check if user exists
//     const userExists = await prisma.user.findUnique({
//       where: { id: userId },
//     });

//     if (!userExists) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // Create address
//     const address = await prisma.address.create({
//       data: {
//         userId,
//         street,
//         city,
//         state,
//         postalCode: zipCode,
//         country,
//         userId,
//       },
//     });

//     res.status(201).json({
//       success: true,
//       address,
//     });
//   } catch (error) {
//     console.error("Error creating address:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error creating address",
//       error: error.message,
//     });
//   }
// };

// Get all addresses for a user
exports.getUserAddresses = async (req, res) => {
  try {
    const { userId } = req.params;

    const addresses = await prisma.address.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching addresses",
      error: error.message,
    });
  }
};

// Get single address by ID
exports.getAddressById = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await prisma.address.findUnique({
      where: { id },
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      address,
    });
  } catch (error) {
    console.error("Error fetching address:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching address",
      error: error.message,
    });
  }
};

// Update address
exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { street, city, state, zipCode, country } = req.body;

    // Check if address exists
    const addressExists = await prisma.address.findUnique({
      where: { id },
    });

    if (!addressExists) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // Update address
    const updatedAddress = await prisma.address.update({
      where: { id },
      data: {
        street,
        city,
        state,
        zipCode,
        country,
      },
    });

    res.status(200).json({
      success: true,
      address: updatedAddress,
    });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({
      success: false,
      message: "Error updating address",
      error: error.message,
    });
  }
};

// Delete address
exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if address exists
    const addressExists = await prisma.address.findUnique({
      where: { id },
    });

    if (!addressExists) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // Check if address is used in any orders
    const addressInUse = await prisma.order.findFirst({
      where: { addressId: id },
    });

    if (addressInUse) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete address as it is associated with orders",
      });
    }

    // Delete address
    await prisma.address.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting address",
      error: error.message,
    });
  }
};
