import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CalendarDays, FileText, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../ui/button.jsx";

/*
==================================================
LEAVE REQUEST MODAL
--------------------------------------------------
Purpose:
  Modal form for submitting a new leave request.
  Validates date range client-side before submission.

Props:
  - isOpen: boolean — controls visibility
  - onClose: () => void
  - onSubmit: (payload) => Promise<void>
  - isSubmitting: boolean

Colors:
  Uses only CSS theme variables — no hardcoded
  Tailwind palette colors.
==================================================
*/

const LEAVE_TYPES = [
  { value: "PTO", label: "PTO — Paid Time Off" },
  { value: "SICK", label: "SICK — Sick Leave" },
  { value: "WFH", label: "WFH — Work From Home" },
];

const today = () => new Date().toISOString().split("T")[0];

const inputClass =
  "w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20";

const LeaveRequestModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [form, setForm] = useState({
    type: "PTO",
    startDate: today(),
    endDate: today(),
    reason: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.endDate < form.startDate) {
      toast.error("End date cannot be before start date");
      return;
    }
    await onSubmit(form);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setForm({ type: "PTO", startDate: today(), endDate: today(), reason: "" });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <div className="w-full max-w-lg rounded-3xl border border-border bg-card shadow-2xl">

              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-6 py-5">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Apply for Leave
                  </h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Submit a new leave request for approval.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="rounded-xl p-2"
                >
                  <X size={16} />
                </Button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5 p-6">

                {/* Leave Type */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Leave Type
                  </label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  >
                    {LEAVE_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dates */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <CalendarDays size={14} className="text-muted-foreground" />
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={form.startDate}
                      onChange={handleChange}
                      required
                      min={today()}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <CalendarDays size={14} className="text-muted-foreground" />
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={form.endDate}
                      onChange={handleChange}
                      required
                      min={form.startDate}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <FileText size={14} className="text-muted-foreground" />
                    Reason{" "}
                    <span className="font-normal text-muted-foreground">(optional)</span>
                  </label>
                  <textarea
                    name="reason"
                    value={form.reason}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Brief reason for your leave..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1 rounded-2xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rounded-2xl"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Request"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LeaveRequestModal;
