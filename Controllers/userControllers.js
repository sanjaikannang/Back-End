import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../Models/userModel.js";

// Signup
export const signup = async (req, res) => {
  try {
    const { name, password, email, gender } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      password: hashedPassword,
      email,
      gender
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Update last login date
    user.lastLoginDate = new Date();
    await user.save();

    // Update login count
    user.count += 1;
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: "10h" });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user details
export const getUserDetails = async (req, res) => {
    try {
        // User ID is available in req.user.id, which is set by the auth middleware
        const userId = req.user.id;

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Extract the required fields
        const userDetails = {
            name: user.name,
            email: user.email,
            gender: user.gender,
            count: user.count
        };

        res.status(200).json(userDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email and password match the admin credentials
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Generate JWT token
    const token = jwt.sign({ email: process.env.ADMIN_EMAIL }, process.env.JWT_SECRET, { expiresIn: "10h" });

    res.status(200).json({ message: "Admin login successful", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    // Retrieve all users
    const users = await User.find({}, "name email count gender lastLoginDate");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};