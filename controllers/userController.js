import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const signup = async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    console.log("Request body:", req.body);
    if (!name || !email || !password || !role || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required fields!",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email is already registered!",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      address,
    });

    res.status(201).json({
      success: true,
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: "Signup successful!",
    });
  } catch (error) {
    console.error("Error in signup:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered",
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), //3days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      };

      res.cookie("token", token, options);
      res.status(200).json({
        success: true,
        token,
        user: { ...user._doc, password: undefined },
        message: "User logged in successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Incorrect Password",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Logout
export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateUser = async (req, res) => {
  const allowedFields = ["name", "phone", "address"];

  const { userid } = req.params;
  const updateData = req.body;

  // Filter the update data to include only allowed fields
  const filteredData = Object.keys(updateData).reduce((acc, key) => {
    if (allowedFields.includes(key)) {
      acc[key] = updateData[key];
    }
    return acc;
  }, {});

  if (Object.keys(filteredData).length === 0) {
    return res
      .status(400)
      .json({ message: "No valid fields provided for update" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userid,
      { $set: filteredData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User details updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user details:", error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error", error: error.message });
    }
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

//get user by id
export const getUserById = async (req, res) => {
  const { userid } = req.params;

  try {
    const user = await User.findById(userid).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({
      error: "Invalid ID format or server error!",
      details: err.message,
    });
  }
};
