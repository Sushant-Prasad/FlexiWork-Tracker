import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
	getAdminDashboard,
	getEmployeeDashboard,
	getHeatmap,
	getManagerDashboard,
	getOverview,
} from "../controllers/dashboardController.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const dashboardRoutes = express.Router();

dashboardRoutes.get("/overview", authMiddleware, getOverview);

dashboardRoutes.get("/heatmap", authMiddleware, getHeatmap);

dashboardRoutes.get(
	"/employee",
	authMiddleware,
	roleMiddleware("EMPLOYEE"),
	getEmployeeDashboard
);

dashboardRoutes.get(
	"/manager",
	authMiddleware,
	roleMiddleware("MANAGER"),
	getManagerDashboard
);

dashboardRoutes.get(
	"/admin",
	authMiddleware,
	roleMiddleware("SYSTEM_ADMIN"),
	getAdminDashboard
);

export default dashboardRoutes;
