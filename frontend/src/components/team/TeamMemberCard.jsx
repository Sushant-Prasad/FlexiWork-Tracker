import { Mail, Crown, ShieldCheck } from "lucide-react";
import { Badge } from "../ui/badge.jsx";

/*
==================================================
TEAM MEMBER CARD
--------------------------------------------------
Purpose:
  Individual member card showing avatar, name,
  role badge, email link, and timezone.
  Used inside the TeamMembersGrid.

Props:
  - member: user object
==================================================
*/

const ROLE_BADGE = {
  MANAGER: { label: "Manager", variant: "default", icon: Crown },
  SYSTEM_ADMIN: { label: "Admin", variant: "destructive", icon: ShieldCheck },
  EMPLOYEE: { label: "Employee", variant: "secondary", icon: null },
};

const ROLE_COLORS = {
  MANAGER: "bg-primary text-white",
  SYSTEM_ADMIN: "bg-destructive text-white",
  EMPLOYEE: "bg-secondary text-secondary-foreground",
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const TeamMemberCard = ({ member }) => {
  const roleCfg = ROLE_BADGE[member.role] || ROLE_BADGE.EMPLOYEE;
  const RoleIcon = roleCfg.icon;
  const avatarColorClass = ROLE_COLORS[member.role] || ROLE_COLORS.EMPLOYEE;

  return (
    <div className="group flex flex-col rounded-3xl border border-border bg-card p-5 shadow-[0_4px_14px_rgba(15,23,42,0.06)] transition hover:shadow-[0_8px_24px_rgba(15,23,42,0.1)] hover:-translate-y-0.5">

      {/* Top — avatar + role badge */}
      <div className="flex items-start justify-between">
        <div className="relative">
          {member.avatarUrl ? (
            <img
              src={member.avatarUrl}
              alt={member.name}
              className="h-12 w-12 rounded-2xl object-cover"
            />
          ) : (
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-bold ${avatarColorClass}`}
            >
              {getInitials(member.name)}
            </div>
          )}
          {/* Manager crown overlay */}
          {member.role === "MANAGER" && (
            <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary shadow">
              <Crown size={10} className="text-white" />
            </div>
          )}
        </div>

        <Badge variant={roleCfg.variant} className="gap-1 text-[10px]">
          {RoleIcon && <RoleIcon size={10} />}
          {roleCfg.label}
        </Badge>
      </div>

      {/* Middle — name & email */}
      <div className="mt-4 flex-1">
        <h3 className="text-sm font-semibold text-foreground leading-tight">
          {member.name}
        </h3>
        <a
          href={`mailto:${member.email}`}
          className="mt-1 flex items-center gap-1 text-xs text-muted-foreground transition hover:text-primary"
        >
          <Mail size={11} />
          <span className="truncate">{member.email}</span>
        </a>
      </div>

      {/* Bottom — timezone */}
      {member.timezone && (
        <div className="mt-4 border-t border-border pt-3">
          <p className="text-[11px] text-muted-foreground">
            {member.timezone}
          </p>
        </div>
      )}
    </div>
  );
};

export default TeamMemberCard;
