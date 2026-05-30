import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  LogIn,
  LogOut,
  Clock,
  Wifi,
  Building2,
  Layers,
  Pencil,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { Badge } from "../ui/badge.jsx";
import { Button } from "../ui/button.jsx";
import {
  createOrUpdateWorkLog,
  updateWorkLog,
} from "../../services/workLogServices.js";

/*
==================================================
TODAY WORK LOG CARD
--------------------------------------------------
Purpose:
  Displays today's work log status with Check In,
  Check Out, and Edit Comment actions. Fires
  mutations against POST /api/worklogs and
  PATCH /api/worklogs/:id.

Props:
  - todayLog: object — today's work log record
  - isLoading: boolean
==================================================
*/

const TOKEN_KEY = "flexiwork_token";

const formatTime = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const MODE_CONFIG = {
  OFFICE: { label: "Office", icon: Building2, variant: "default" },
  REMOTE: { label: "Remote", icon: Wifi, variant: "secondary" },
  HYBRID: { label: "Hybrid", icon: Layers, variant: "secondary" },
  UNLOGGED: { label: "Not Logged", icon: AlertCircle, variant: "outline" },
};

const WORK_MODES = ["OFFICE", "REMOTE", "HYBRID"];

const TodayWorkLogCard = ({ todayLog, isLoading }) => {
  const queryClient = useQueryClient();
  const [selectedMode, setSelectedMode] = useState("REMOTE");
  const [showModeSelect, setShowModeSelect] = useState(false);
  const [comment, setComment] = useState("");
  const [showCommentEdit, setShowCommentEdit] = useState(false);

  const mode = todayLog?.actualMode || "UNLOGGED";
  const modeConfig = MODE_CONFIG[mode] || MODE_CONFIG.UNLOGGED;
  const ModeIcon = modeConfig.icon;
  const isActive = mode !== "UNLOGGED";
  const isCheckedOut = !!todayLog?.checkOutAt;

  // ── Mutations ───────────────────────────────────────────────────
  const { mutate: checkIn, isPending: checkingIn } = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      return createOrUpdateWorkLog(
        {
          actualMode: selectedMode,
          checkInAt: new Date().toISOString(),
        },
        token
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["worklog-today"] });
      queryClient.invalidateQueries({ queryKey: ["my-worklogs"] });
      toast.success("Checked in successfully!");
      setShowModeSelect(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const { mutate: checkOut, isPending: checkingOut } = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      return updateWorkLog(
        todayLog._id,
        { checkOutAt: new Date().toISOString() },
        token
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["worklog-today"] });
      queryClient.invalidateQueries({ queryKey: ["my-worklogs"] });
      toast.success("Checked out successfully!");
    },
    onError: (err) => toast.error(err.message),
  });

  const { mutate: saveComment, isPending: savingComment } = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      return updateWorkLog(todayLog._id, { comments: comment }, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["worklog-today"] });
      toast.success("Comment saved!");
      setShowCommentEdit(false);
    },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading) {
    return <div className="h-52 animate-pulse rounded-3xl bg-muted" />;
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_4px_14px_rgba(15,23,42,0.06)]">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Today's Work Log
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <Badge variant={modeConfig.variant} className="gap-1">
          <ModeIcon size={12} />
          {modeConfig.label}
        </Badge>
      </div>

      {/* Info Grid */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        {[
          {
            label: "Check In",
            value: formatTime(todayLog?.checkInAt),
            icon: LogIn,
          },
          {
            label: "Check Out",
            value: formatTime(todayLog?.checkOutAt),
            icon: LogOut,
          },
          {
            label: "Worked Hours",
            value: todayLog?.workedHours
              ? `${todayLog.workedHours} hrs`
              : "—",
            icon: Clock,
          },
          {
            label: "Status",
            value: isCheckedOut
              ? "Completed"
              : isActive
              ? "Active"
              : "Not Started",
            icon: CheckCircle2,
            accent: true,
          },
        ].map(({ label, value, icon: Icon, accent }) => (
          <div key={label} className="rounded-2xl bg-secondary px-4 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon size={15} />
              </div>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                {label}
              </p>
            </div>
            <p
              className={`mt-2 text-sm font-semibold ${
                accent && isActive ? "text-primary" : "text-foreground"
              }`}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">

        {/* Check In flow */}
        {!isActive && !showModeSelect && (
          <Button
            onClick={() => setShowModeSelect(true)}
            className="gap-2 rounded-2xl"
          >
            <LogIn size={15} />
            Check In
          </Button>
        )}

        {!isActive && showModeSelect && (
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="rounded-2xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            >
              {WORK_MODES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <Button
              onClick={() => checkIn()}
              disabled={checkingIn}
              className="gap-2 rounded-2xl"
            >
              <LogIn size={15} />
              {checkingIn ? "Checking in..." : "Confirm"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowModeSelect(false)}
              className="rounded-2xl"
            >
              Cancel
            </Button>
          </div>
        )}

        {/* Check Out */}
        {isActive && !isCheckedOut && (
          <Button
            variant="outline"
            onClick={() => checkOut()}
            disabled={checkingOut}
            className="gap-2 rounded-2xl"
          >
            <LogOut size={15} />
            {checkingOut ? "Checking out..." : "Check Out"}
          </Button>
        )}

        {/* Edit Comment */}
        {isActive && !showCommentEdit && (
          <Button
            variant="outline"
            onClick={() => {
              setComment(todayLog?.comments || "");
              setShowCommentEdit(true);
            }}
            className="gap-2 rounded-2xl"
          >
            <Pencil size={14} />
            Edit Comment
          </Button>
        )}
      </div>

      {/* Comment editor */}
      {showCommentEdit && (
        <div className="mt-4 space-y-3">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
            placeholder="Add a note about today's work..."
            className="w-full resize-none rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
          />
          <div className="flex gap-2">
            <Button
              onClick={() => saveComment()}
              disabled={savingComment}
              size="sm"
              className="rounded-xl"
            >
              {savingComment ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCommentEdit(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

    </div>
  );
};

export default TodayWorkLogCard;
