import express from "express";
import { login, signup, getUserDetails, adminLogin, getAllUsers } from "../Controllers/userControllers.js";
import auth from "../middlewares/auth.js"

const router = express.Router();

// User routes
router.post("/signup", signup);// signup route
router.post("/login", login);// login route
router.get("/specific-user", auth, getUserDetails);// getting specific user details route

// Admin routes
router.post("/admin/login", adminLogin);
router.get("/admin/users", auth, getAllUsers);


export default router;