const STATUS_OPTIONS = ["TODO", "IN_PROGRESS", "TESTING", "READY_FOR_REVIEW"];

const TaskDetailsModal = ({ task, onClose, onUpdateStatus }) => {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.2)]">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">{task.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Project: {task.projectName || "Unassigned"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border px-3 py-1 text-sm text-foreground"
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Priority
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground">{task.priority}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Assigned Date
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground">
              {task.assignedDate || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Due Date
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground">
              {task.dueDate || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Status
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground">{task.statusLabel}</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Description
          </p>
          <p className="mt-2 text-sm text-foreground">
            {task.description || "No description provided."}
          </p>
        </div>

        <div className="mt-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Comments
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {task.notes || "No comments yet."}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => onUpdateStatus(task, status)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                task.status === status
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-white text-foreground"
              }`}
              disabled={!task.allowedStatusUpdates.includes(status)}
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
