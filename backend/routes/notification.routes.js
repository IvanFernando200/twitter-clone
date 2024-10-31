import { Router } from "express";
import {
  deleteNotifications,
  deleteNotification,
  getNotifications,
} from "../controllers/notification.controllers.js";
import { protectRoute } from "../middlewares/auth.middlewares.js";

const notificationRoutes = Router();

notificationRoutes.get("/", protectRoute, getNotifications);
notificationRoutes.delete("/:id", protectRoute, deleteNotifications);
notificationRoutes.delete("/", protectRoute, deleteNotification);

export default notificationRoutes;
