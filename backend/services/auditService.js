import Audit from "../models/Audit.js";

/*
==================================================
CREATE AUDIT ENTRY
--------------------------------------------------
Purpose:
Creates audit history entry for important actions.

Used For:
- ShiftPlan updates
- WorkLog overrides
- Team changes
- Role updates
- Leave approvals
==================================================
*/
export const createAuditLog = async ({
  actorId,
  action,
  entity,
  entityId,
  before = null,
  after = null,
  reason = "",
  metadata = {},
}) => {
  try {
    await Audit.create({
      actorId,
      action,
      entity,
      entityId,
      before,
      after,
      reason,
      metadata,
    });
  } catch (error) {
    console.error("Audit log creation failed:", error.message);
  }
};
