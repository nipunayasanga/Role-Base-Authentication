const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { authenticateToken, authorizeRoles } = require("../middleware/auth"); // Import the authentication and authorization middleware
const router = express.Router();

// Register user
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body; //add role

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role,
    });
    await user.save();

    const payload = { user: { id: user.id, role: user.role } };

    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" }); // Handle user not found

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" }); // Handle password mismatch

    const payload = { user: { id: user.id, role: user.role } };

    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Get authenticated user profile
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Example route with role-based authorization
// Only admins can access this route
router.delete(
  "/admin/delete_user/:id",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      // Logic for deleting user by ID
      await User.findByIdAndDelete(req.params.id);
      res.json({ msg: "User deleted successfully" });
    } catch (err) {
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
