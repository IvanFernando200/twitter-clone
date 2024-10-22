import express from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
} from "../controllers/auth.controllers.js";

const authRoutes = express.Router();

authRoutes.post("/signup", signupUser);

authRoutes.post("/login", loginUser);

authRoutes.post("/logout", logoutUser);

export default authRoutes;
