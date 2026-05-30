import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

import { createLeaveRequest, getMyLeaves } from "../../services/leaveServices.js";
import { Button } from "../../components/ui/button.jsx";
import LeaveStats from "../../components/leaves/LeaveStats.jsx";
import LeaveRequestModal from "../../components/leaves/LeaveRequestModal.jsx";
import UpcomingLeaves from "../../components/leaves/UpcomingLeaves.jsx";
import LeaveHistoryTable from "../../components/leaves/LeaveHistoryTable.jsx";
import LeaveUsageChart from "../../components/leaves/LeaveUsageChart.jsx";
import { FadeIn } from "../../components/motion/FadeIn.jsx";

/*
==================================================
MY LEAVES PAGE
--------------------------------------------------
API:
  GET  /api/leaves/me  — fetches all user leaves
  POST /api/leaves     — submits a new leave request

Purpose:
  Displays leave summary stats, apply leave modal,
  upcoming approved leaves, full leave history
  table, and a monthly usage chart.

Business Logic:
  All stats (total, pending, approved, rejected)
  are computed from the single leave list response.
  No extra analytics API is required.

Colors:
  Uses only CSS theme variables — no hardcoded
  Tailwind palette colors.
==================================================
*/

const TOKEN_KEY = "flexiwork_token";

const computeStats = (leaves) => ({
  total: leaves.length,
  pending: leaves.filter((l) => l.status === "PENDING").length,
  approved: leaves.filter((l) => l.status === "APPROVED").length,
  rejected: leaves.filter((l) => l.status === "REJECTED").length,
});

const MyLeaves = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // ── Fetch all my leaves ──────────────────────────────────────────
  const { data, isLoading, error } = useQuery({
    queryKey: ["my-leaves"],
    queryFn: async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) throw new Error("Authentication token missing.");
      return getMyLeaves(token);
    },
  });

  const leaves = useMemo(
    () => data?.data || data?.leaves || [],
    [data]
  );

  const stats = useMemo(() => computeStats(leaves), [leaves]);

  const upcomingCount = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    return leaves.filter(
      (l) => l.status === "APPROVED" && l.endDate >= todayStr
    ).length;
  }, [leaves]);

  // ── Submit leave request ─────────────────────────────────────────
  const { mutateAsync: submitLeave, isPending: isSubmitting } = useMutation({
    mutationFn: async (payload) => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) throw new Error("Authentication token missing.");
      return createLeaveRequest(payload, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-leaves"] });
      toast.success("Leave request submitted successfully!");
      setModalOpen(false);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to submit leave request.");
    },
  });

  return (
    <section className="space-y-8">

      {/* ── Page Header ────────────────────────────────────────────── */}
      <FadeIn>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              My Leaves
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Request leave and monitor your approval status.
            </p>
          </div>

          <Button
            onClick={() => setModalOpen(true)}
            className="gap-2 rounded-2xl px-5"
          >
            <Plus size={16} />
            Apply Leave
          </Button>
        </div>
      </FadeIn>

      {/* ── Error State ────────────────────────────────────────────── */}
      {error && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Failed to load leave data. Please try again.
        </div>
      )}

      {/* ── Stats Row ──────────────────────────────────────────────── */}
      <FadeIn delay={0.05}>
        <LeaveStats stats={stats} isLoading={isLoading} />
      </FadeIn>

      {/* ── Upcoming + Chart ───────────────────────────────────────── */}
      <FadeIn delay={0.1}>
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Upcoming Leaves */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_4px_14px_rgba(15,23,42,0.06)]">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">
                Upcoming Leaves
              </h2>
              {!isLoading && (
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                  {upcomingCount} scheduled
                </span>
              )}
            </div>
            <UpcomingLeaves leaves={leaves} isLoading={isLoading} />
          </div>

          {/* Usage Chart */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_4px_14px_rgba(15,23,42,0.06)]">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-foreground">
                Leave Usage Trend
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Approved leave days per month this year
              </p>
            </div>
            <LeaveUsageChart leaves={leaves} isLoading={isLoading} />
          </div>

        </div>
      </FadeIn>

      {/* ── Leave History Table ─────────────────────────────────────── */}
      <FadeIn delay={0.15}>
        <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_4px_14px_rgba(15,23,42,0.06)]">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">
              Leave History
            </h2>
            {!isLoading && (
              <span className="text-sm text-muted-foreground">
                {leaves.length} {leaves.length === 1 ? "request" : "requests"} total
              </span>
            )}
          </div>
          <LeaveHistoryTable leaves={leaves} isLoading={isLoading} />
        </div>
      </FadeIn>

      {/* ── Apply Leave Modal ───────────────────────────────────────── */}
      <LeaveRequestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={submitLeave}
        isSubmitting={isSubmitting}
      />

    </section>
  );
};

export default MyLeaves;
