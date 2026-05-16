// Check whether the role can apply for leave
export const canApplyLeave = (role) => {
  return role === "EMPLOYEE";
};

// Check whether the role can approve/reject leave
export const canApproveLeave = (role) => {
  return ["MANAGER", "SYSTEM_ADMIN"].includes(role);
};
