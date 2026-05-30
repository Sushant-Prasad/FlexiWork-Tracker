import { Mail, ShieldCheck, Hash, Calendar } from "lucide-react";
import { Badge } from "../ui/badge.jsx";

/*
==================================================
ACCOUNT INFO CARD
--------------------------------------------------
Purpose:
  Read-only display of system-controlled fields:
  email, role, user ID, and account creation date.

Props:
  - user: profile object
  - isLoading: boolean
==================================================
*/

const ROLE_BADGE = {
  EMPLOYEE: { label: "Employee", variant: "secondary" },
  MANAGER: { label: "Manager", variant: "default" },
  SYSTEM_ADMIN: { label: "System Admin", variant: "destructive" },
};

const formatDate = (str) => {
  if (!str) return "—";
  return new Date(str).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const ReadOnlyRow = ({ icon: Icon, label, value, children }) => (
  <div className="flex items-start justify-between gap-4 py-3.5 border-b border-border last:border-0">
    <div className="flex items-center gap-2.5 shrink-0">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary text-primary">
        <Icon size={14} />
      </div>
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </span>
    </div>
    {children || (
      <span className="text-sm font-medium text-foreground text-right break-all">
        {value}
      </span>
    )}
  </div>
);

const AccountInfoCard = ({ user, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-14 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    );
  }

  const roleCfg = ROLE_BADGE[user?.role] || ROLE_BADGE.EMPLOYEE;

  return (
    <div className="divide-y divide-border">
      <ReadOnlyRow icon={Mail} label="Email" value={user?.email} />
      <ReadOnlyRow icon={ShieldCheck} label="Role">
        <Badge variant={roleCfg.variant}>{roleCfg.label}</Badge>
      </ReadOnlyRow>
      <ReadOnlyRow icon={Hash} label="User ID">
        <span className="rounded-xl bg-secondary px-3 py-1 font-mono text-[11px] text-secondary-foreground">
          {user?._id || "—"}
        </span>
      </ReadOnlyRow>
      <ReadOnlyRow icon={Calendar} label="Member Since" value={formatDate(user?.createdAt)} />
    </div>
  );
};

export default AccountInfoCard;
