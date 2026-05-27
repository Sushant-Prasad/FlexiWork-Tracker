import Audit from "../models/Audit.js";

/*
==================================================
GET AUDIT HISTORY
--------------------------------------------------
Purpose:
Fetch all audit logs from the database.

Used For:
- Admin dashboard
- Manager history view
- Compliance tracking
- Troubleshooting
- Change history timeline

Features:
- Fetch audit entries
- Populate actor details
- Latest audits first
==================================================
*/
export const getAuditHistory = async (
  req,
  res
) => {

  try {

    /*
    ==============================================
    FETCH AUDIT LOGS
    ----------------------------------------------
    Populate actor information:
    - name
    - email
    - role

    Sort:
    Latest audit entries first.
    ==============================================
    */
    const audits = await Audit.find()
      .populate(
        "actorId",
        "name email role"
      )
      .sort({ createdAt: -1 });

    /*
    ==============================================
    SUCCESS RESPONSE
    ==============================================
    */
    return res.status(200).json({

      success: true,

      data: audits,

    });

  } catch (error) {

    /*
    ==============================================
    ERROR RESPONSE
    ==============================================
    */
    return res.status(500).json({

      success: false,

      message:
        error.message ||
        "Failed to fetch audit history",

    });

  }
};