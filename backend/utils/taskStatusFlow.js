// Defines valid task status transitions
export const TASK_FLOW = {
  TODO: ["IN_PROGRESS"],
  IN_PROGRESS: ["READY_FOR_REVIEW"],
  READY_FOR_REVIEW: ["TESTING"],
  TESTING: ["DONE", "CHANGES_REQUESTED"],
  CHANGES_REQUESTED: ["IN_PROGRESS"],
};
