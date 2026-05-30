import { Mail, Crown } from "lucide-react";
import { Badge } from "../ui/badge.jsx";

/*
==================================================
MANAGER CARD
--------------------------------------------------
Purpose:
  Displays the team manager prominently — separate
  from the members grid so employees can find their
  manager at a glance.

Props:
  - manager: user object (role === "MANAGER") or null
  - isLoading: boolean
==================================================
*/

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const ManagerCard = ({ manager, isLoading }) => {
  if (isLoading) {
    return <div className="h-36 animate-pulse rounded-3xl bg-muted" />;
  }

  if (!manager) {
    return (
      <div className="flex items-center justify-center rounded-3xl border border-dashed border-border bg-muted/30 py-10">
        <p className="text-sm text-muted-foreground">No manager assigned to this team.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6 rounded-3xl border border-primary/20 bg-primary/5 p-6 shadow-[0_4px_14px_rgba(15,23,42,0.06)]">
      {/* Avatar */}
      <div className="relative shrink-0">
        {manager.avatarUrl ? (
          <img
            src={manager.avatarUrl}
            alt={manager.name}
            className="h-16 w-16 rounded-2xl object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-white">
            {getInitials(manager.name)}
          </div>
        )}
        {/* Manager crown badge */}
        <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary shadow-md">
          <Crown size={12} className="text-white" />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-semibold text-foreground">{manager.name}</h3>
          <Badge variant="default" className="text-[10px]">Manager</Badge>
        </div>
        <a
          href={`mailto:${manager.email}`}
          className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-primary"
        >
          <Mail size={13} />
          {manager.email}
        </a>
        {manager.timezone && (
          <p className="mt-1 text-xs text-muted-foreground">
            Timezone: {manager.timezone}
          </p>
        )}
      </div>
    </div>
  );
};

export default ManagerCard;
