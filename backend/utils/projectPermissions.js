// Check whether the role can manage projects
export const canManageProject = (role) => {
  return ["MANAGER", "SYSTEM_ADMIN"].includes(role);
};

// Check whether the role can delete projects
export const canDeleteProject = (role) => {
  return role === "SYSTEM_ADMIN";
};
