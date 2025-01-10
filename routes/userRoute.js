import express from "express";
import { auth } from "../middlewares/auth.js";
import { getUserById, getUsers, login, logout, signup, updateUser } from "../controllers/userController.js";

const router = express.Router();

// Public Routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);


//update user profile
router.get("/all-user",getUsers);
router.get("/:userid", getUserById);
router.patch("/update/:userid",auth,updateUser);

export default router;