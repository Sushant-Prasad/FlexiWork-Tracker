/*
==================================================
TASK DETAILS MODAL
--------------------------------------------------
Component:
TaskDetailsModal

Props:
- task
- isLoading
- onClose
- onUpdateStatus

Purpose:
Displays complete information about a
selected task and allows employees to
update its status.

Used In:
Employee My Tasks Page

Related APIs:
GET   /api/tasks/me
PATCH /api/tasks/:id

Features:
- Task Information
- Project Details
- Priority
- Assignment Details
- Due Date
- Description
- Comments
- Status Management
- Modal Overlay

Business Value:
Provides a centralized interface for
employees to review task details and
update task progress without leaving
the current page.

Workflow:
1. User selects a task
2. Parent opens modal
3. Task information is displayed
4. Employee reviews details
5. Employee updates task status
6. Parent handles API request
7. Modal can be closed anytime

Return:
Task details modal dialog.
==================================================
*/

const TaskDetailsModal = ({
  task,
  isLoading = false,
  onClose,
  onUpdateStatus,
}) => {

  /*
  ==========================================
  SAFETY CHECK
  ------------------------------------------
  Purpose:
  Prevent rendering when no task has
  been selected.

  Business Logic:
  Avoids rendering an empty modal.
  ==========================================
  */
  if (!task) return null;

  /*
  ==========================================
  STATUS OPTIONS
  ------------------------------------------
  Purpose:
  Combines current task status with all
  allowed status transitions.

  Business Logic:
  Ensures current status is always
  visible while preventing duplicate
  status entries.
  ==========================================
  */
  const statusOptions = [
    task.status,
    ...(task.allowedStatusUpdates || []),
  ].filter(Boolean);

  return (

    /*
    ==========================================
    MODAL OVERLAY
    ------------------------------------------
    Darkens background and centers the
    task details dialog.
    ==========================================
    */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      {/* ======================================
          MODAL CONTAINER
      ====================================== */}
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.2)]">

        {/* ======================================
            HEADER SECTION
            --------------------------------------
            Displays task title, project name,
            and close button.
        ====================================== */}
        <div className="flex items-start justify-between">

          <div>

            {/* Task Title */}
            <h2 className="text-2xl font-semibold text-foreground">

              {task.title}

            </h2>

            {/* Project Name */}
            <p className="mt-1 text-sm text-muted-foreground">

              Project: {task.projectName || "Unassigned"}

            </p>

          </div>

          {/* Close Modal */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border px-3 py-1 text-sm text-foreground"
          >
            Close
          </button>

        </div>

        {/* ======================================
            TASK INFORMATION GRID
            --------------------------------------
            Displays important metadata:
            - Priority
            - Assigned Date
            - Due Date
            - Current Status
        ====================================== */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">

          {/* Priority */}
          <div>

            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Priority
            </p>

            <p className="mt-2 text-sm font-semibold text-foreground">
              {task.priority}
            </p>

          </div>

          {/* Assigned Date */}
          <div>

            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Assigned Date
            </p>

            <p className="mt-2 text-sm font-semibold text-foreground">
              {task.assignedDate || "N/A"}
            </p>

          </div>

          {/* Due Date */}
          <div>

            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Due Date
            </p>

            <p className="mt-2 text-sm font-semibold text-foreground">
              {task.dueDate || "N/A"}
            </p>

          </div>

          {/* Current Status */}
          <div>

            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Status
            </p>

            <p className="mt-2 text-sm font-semibold text-foreground">
              {task.statusLabel}
            </p>

          </div>

        </div>

        {/* ======================================
            TASK DESCRIPTION
            --------------------------------------
            Displays complete task description.

            Shows loading message while task
            details are being fetched.
        ====================================== */}
        <div className="mt-6">

          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Description
          </p>

          <p className="mt-2 text-sm text-foreground">

            {isLoading
              ? "Loading task details..."
              : task.description || "No description provided."}

          </p>

        </div>

        {/* ======================================
            TASK COMMENTS
            --------------------------------------
            Displays notes or comments added
            by the manager or employee.
        ====================================== */}
        <div className="mt-6">

          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Comments
          </p>

          <p className="mt-2 text-sm text-muted-foreground">

            {task.notes || "No comments yet."}

          </p>

        </div>

        {/* ======================================
            STATUS UPDATE ACTIONS
            --------------------------------------
            Displays all allowed task status
            transitions.

            Business Rules:
            - Current status remains highlighted.
            - Only statuses provided by
              allowedStatusUpdates are clickable.
            - Parent component performs
              the actual API update.
        ====================================== */}
        <div className="mt-6 flex flex-wrap items-center gap-3">

          {statusOptions.map((status) => (

            <button
              key={status}
              type="button"
              onClick={() =>
                onUpdateStatus(task, status)
              }
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                task.status === status
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-white text-foreground"
              }`}
              disabled={
                isLoading ||
                !task.allowedStatusUpdates.includes(status)
              }
            >

              {status.replace(/_/g, " ")}

            </button>

          ))}

        </div>

      </div>

    </div>
  );
};

export default TaskDetailsModal;