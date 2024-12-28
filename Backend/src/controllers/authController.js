const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

// this function to generate jwt token for a user
const generateToken = user => {
  return jwt.sign(
    // Include user-specific information in the token payload: id, email, and role
    { id: user.id, email: user.email, role: user.role },

    // Use the secret key from environment variables to sign the token
    process.env.JWT_SECRET,

    // Set the token to expire in 1 day
    { expiresIn: "1d" }
  );
};

// Controller function to handle user registration
exports.register = async (req, res) => {
  // Extract user details from the request body
  const { name, email, password, role } = req.body;

  try {
    // Check if a user with the provided email already exists in the database
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      // If a user with the email exists, respond with a 400 status and an error message
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate a salt for hashing the password
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user in the database with the provided and hashed details
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
      select: {
        // Select specific fields to return from the newly created user
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    // Generate a JWT token for the newly created user
    const token = generateToken(newUser);

    // Respond with a success status, user details, and the JWT token
    res.status(201).json({ success: true, user: newUser, token });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    // check if user is already logged in
    if (!user) {
      return res.status(404).json({ error: "Invalid Credentials" });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    const token = generateToken(user);

    res.status(400).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log("login error", error);
    res.status(5000).json({ success: false, message: error.message });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const user = await prisma.user?.findMany();
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfileImage = async (req, res) => {
  try {
    // const { userId, profileImage } = req.body;
    // const user = await prisma.user.update({
    //   where: { id: userId },
    //   data: { profileImage },
    // });

    // res.json({ success: true, user });

    res.send("yet logic is not implemented 😂");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
