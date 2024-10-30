import express from "express";
import {
  getProfile,
  getUserProfile,
  followUnfollowUser,
  updateUserProfile,
} from "../controllers/user.controllers.js";
import { protectRoute } from "../middleware/protectRoute.js";

const userRoutes = express.Router();

userRoutes.get("/profile/:username", protectRoute, getProfile);
userRoutes.get("/suggested", protectRoute, getUserProfile);
userRoutes.post("/follow/:id", protectRoute, followUnfollowUser);
userRoutes.post("/update", protectRoute, updateUserProfile);

export default userRoutes;
