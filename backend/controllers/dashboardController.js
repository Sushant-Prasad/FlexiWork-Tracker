import {
	getHeatmapData,
	getOverviewData,
} from "../services/dashboardService.js";

export const getOverview = async (req, res) => {
	try {
		const data = await getOverviewData(req.user);

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
		const data = await getHeatmapData();

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
