import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  CalendarDays,
  FileText,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../ui/button.jsx";

/*
==================================================
LEAVE REQUEST MODAL
--------------------------------------------------
Component:
LeaveRequestModal

Props:
- isOpen
- onClose
- onSubmit
- isSubmitting

Purpose:
Displays a modal dialog that allows an
employee to submit a new leave request.

Used In:
Employee Leave Management Page

Related API:
POST /api/leaves

Features:
- Animated Modal
- Leave Type Selection
- Date Validation
- Leave Reason
- Loading State
- Form Reset
- Client-side Validation

Business Value:
Allows employees to quickly submit leave
requests while preventing invalid date
ranges before reaching the server.

Workflow:
1. Open modal.
2. Select leave type.
3. Choose start and end dates.
4. Enter optional reason.
5. Validate date range.
6. Submit leave request.
7. Close and reset form.

Returns:
Animated leave request modal.
==================================================
*/

/*
==================================================
LEAVE TYPE OPTIONS
--------------------------------------------------
Purpose:
Defines all supported leave request types.

Business Logic:
Centralizes leave options for easier
maintenance and future expansion.
==================================================
*/
const LEAVE_TYPES = [
  {
    value: "PTO",
    label: "PTO — Paid Time Off",
  },
  {
    value: "SICK",
    label: "SICK — Sick Leave",
  },
  {
    value: "WFH",
    label: "WFH — Work From Home",
  },
];

/*
==================================================
GET TODAY'S DATE
--------------------------------------------------
Purpose:
Returns today's date in YYYY-MM-DD format.

Used For:
- Default form values
- Minimum selectable date

Returns:
Current date string.
==================================================
*/
const today = () =>
  new Date().toISOString().split("T")[0];

/*
==================================================
INPUT STYLING
--------------------------------------------------
Purpose:
Reusable Tailwind class for all form
controls inside the modal.

Business Logic:
Keeps form styling consistent across
all inputs.
==================================================
*/
const inputClass =
  "w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20";

/*
==================================================
LEAVE REQUEST MODAL COMPONENT
--------------------------------------------------
Props:
- isOpen
- onClose
- onSubmit
- isSubmitting

Purpose:
Handles leave request creation and
client-side validation.

Return:
Animated leave request modal.
==================================================
*/
const LeaveRequestModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) => {

  /*
  ==========================================
  FORM STATE
  ------------------------------------------
  Stores leave request information.

  Fields:
  - Leave Type
  - Start Date
  - End Date
  - Reason
  ==========================================
  */
  const [form, setForm] = useState({
    type: "PTO",
    startDate: today(),
    endDate: today(),
    reason: "",
  });

  /*
  ==========================================
  HANDLE INPUT CHANGE
  ------------------------------------------
  Updates form state whenever an input
  value changes.

  Business Logic:
  Uses the input name attribute to update
  the corresponding form field.
  ==========================================
  */
  const handleChange = (event) => {

    setForm((previous) => ({
      ...previous,
      [event.target.name]:
        event.target.value,
    }));

  };

  /*
  ==========================================
  HANDLE FORM SUBMISSION
  ------------------------------------------
  Validates the selected date range
  before submitting the leave request.

  Validation:
  End Date >= Start Date

  Business Logic:
  Prevents invalid leave requests from
  reaching the backend.
  ==========================================
  */
  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();

    if (
      form.endDate <
      form.startDate
    ) {
      toast.error(
        "End date cannot be before start date"
      );
      return;
    }

    await onSubmit(form);

  };

  /*
  ==========================================
  HANDLE MODAL CLOSE
  ------------------------------------------
  Resets the form and closes the modal.

  Business Logic:
  Prevents closing while submission
  is still in progress.
  ==========================================
  */
  const handleClose = () => {

    if (isSubmitting) return;

    setForm({
      type: "PTO",
      startDate: today(),
      endDate: today(),
      reason: "",
    });

    onClose();

  };

  return (

    <AnimatePresence>

      {isOpen && (

        <>

          {/* ==================================
              MODAL BACKDROP
              ----------------------------------
              Dark overlay behind the modal.
          ================================== */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* ==================================
              MODAL CONTAINER
          ================================== */}
          <motion.div
            key="modal"
            initial={{
              opacity: 0,
              y: 32,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 24,
              scale: 0.97,
            }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >

            <div className="w-full max-w-lg rounded-3xl border border-border bg-card shadow-2xl">

              {/* ==================================
                  MODAL HEADER
              ================================== */}
              <div className="flex items-center justify-between border-b border-border px-6 py-5">

                <div>

                  <h2 className="text-lg font-semibold text-foreground">
                    Apply for Leave
                  </h2>

                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Submit a new leave request for approval.
                  </p>

                </div>

                {/* Close Button */}
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

              {/* ==================================
                  LEAVE REQUEST FORM
              ================================== */}
              <form
                onSubmit={handleSubmit}
                className="space-y-5 p-6"
              >

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
                    {LEAVE_TYPES.map(
                      (type) => (
                        <option
                          key={type.value}
                          value={type.value}
                        >
                          {type.label}
                        </option>
                      )
                    )}
                  </select>

                </div>

                {/* Leave Dates */}
                <div className="grid gap-4 sm:grid-cols-2">

                  {/* Start Date */}
                  <div>

                    <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <CalendarDays
                        size={14}
                        className="text-muted-foreground"
                      />
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

                  {/* End Date */}
                  <div>

                    <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <CalendarDays
                        size={14}
                        className="text-muted-foreground"
                      />
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

                {/* Leave Reason */}
                <div>

                  <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">

                    <FileText
                      size={14}
                      className="text-muted-foreground"
                    />

                    Reason

                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>

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

                {/* ==================================
                    ACTION BUTTONS
                ================================== */}
                <div className="flex gap-3 pt-1">

                  {/* Cancel Button */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1 rounded-2xl"
                  >
                    Cancel
                  </Button>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rounded-2xl"
                  >

                    {isSubmitting ? (
                      <>
                        <Loader2
                          size={15}
                          className="animate-spin"
                        />
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