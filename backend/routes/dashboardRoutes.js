import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getHeatmap, getOverview } from "../controllers/dashboardController.js";

const dashboardRoutes = express.Router();

dashboardRoutes.get("/overview", authMiddleware, getOverview);

dashboardRoutes.get("/heatmap", authMiddleware, getHeatmap);

export default dashboardRoutes;
