import {
	getAdminDashboardData,
	getEmployeeDashboardData,
	getHeatmapData,
	getManagerDashboardData,
	getOverviewData,
} from "../services/dashboardService.js";

export const getOverview = async (req, res) => {
	try {
		const { teamId, startDate, endDate } = req.query;
		const data = await getOverviewData(req.user, { teamId, startDate, endDate });

		return res.status(200).json({
			success: true,
			data,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message || "Failed to fetch dashboard overview",
		});
	}
};

export const getHeatmap = async (req, res) => {
	try {
		const { teamId, startDate, endDate } = req.query;
		const data = await getHeatmapData({ teamId, startDate, endDate });

		return res.status(200).json({
			success: true,
			data,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message || "Failed to fetch dashboard heatmap",
		});
	}
};

export const getEmployeeDashboard = async (req, res) => {
	try {
		const data = await getEmployeeDashboardData(req.user);

		return res.status(200).json({
			success: true,
			data,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message || "Failed to fetch employee dashboard",
		});
	}
};

export const getManagerDashboard = async (req, res) => {
	try {
		const { teamId, startDate, endDate } = req.query;
		const data = await getManagerDashboardData(req.user, {
			teamId,
			startDate,
			endDate,
		});

		return res.status(200).json({
			success: true,
			data,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message || "Failed to fetch manager dashboard",
		});
	}
};

export const getAdminDashboard = async (req, res) => {
	try {
		const { teamId, startDate, endDate } = req.query;
		const data = await getAdminDashboardData({
			teamId,
			startDate,
			endDate,
		});

		return res.status(200).json({
			success: true,
			data,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message || "Failed to fetch admin dashboard",
		});
	}
};
