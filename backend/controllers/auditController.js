import Audit from "../models/Audit.js";

export const getAuditHistory = async (req, res) => {
  try {
    const audits = await Audit.find()
      .populate("actorId", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: audits,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch audit history",
    });
  }
};
