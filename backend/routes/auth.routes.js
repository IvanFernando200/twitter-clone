import express from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
  getMe,
} from "../controllers/auth.controllers.js";
import { protectRoute } from "../middleware/protectRoute.js";

const authRoutes = express.Router();

authRoutes.get("/me", protectRoute, getMe);
authRoutes.post("/signup", signupUser);

authRoutes.post("/login", loginUser);

authRoutes.post("/logout", logoutUser);

export default authRoutes;
