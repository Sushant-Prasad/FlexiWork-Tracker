/*
==================================================
TASK CARD COMPONENT
--------------------------------------------------
Component:
TaskCard

Props:
- task
- onOpen

Purpose:
Displays a summary of a single task in
a reusable card layout.

Used In:
Employee My Tasks Page
Manager Task Management Page
Task Search Results

Data Source:
GET /api/tasks/me
GET /api/tasks/project/:projectId

Features:
- Task Title
- Priority Badge
- Project Information
- Status Overview
- Due Date
- Assigned By
- Click to View Details

Business Value:
Provides a concise overview of task
information while allowing users to
quickly open the complete task details.

Workflow:
1. Receive task object
2. Display important task metadata
3. User clicks the card
4. Notify parent component
5. Parent opens task details dialog/page

Return:
Interactive task summary card.
==================================================
*/

const TaskCard = ({
  task,
  onOpen,
}) => {
  return (
    <button
      type="button"
      onClick={() => onOpen(task)}
      className="w-full rounded-2xl border border-border bg-card p-5 text-left shadow-[0_6px_18px_rgba(15,23,42,0.06)] transition hover:-translate-y-1"
    >

      {/* ======================================
          TASK HEADER
          --------------------------------------
          Displays task title and priority.
      ====================================== */}
      <div className="flex items-center justify-between">

        {/* Task Title */}
        <h3 className="text-lg font-semibold text-foreground">

          {task.title}

        </h3>

        {/* Priority Badge */}
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">

          {task.priority}

        </span>

      </div>

      {/* ======================================
          PROJECT INFORMATION
          --------------------------------------
          Displays the project to which the
          task belongs.
      ====================================== */}
      <p className="mt-2 text-sm text-muted-foreground">

        Project: {task.projectName || "Unassigned"}

      </p>

      {/* ======================================
          TASK METADATA
          --------------------------------------
          Displays additional task details:
          - Current Status
          - Due Date
          - Assigned By
      ====================================== */}
      <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">

        {/* Task Status */}
        <span>

          Status: {task.statusLabel}

        </span>

        {/* Due Date */}
        <span>

          Due: {task.dueDate || "N/A"}

        </span>

        {/* Assigned By */}
        <span>

          Assigned By: {task.assignedByName || "Manager"}

        </span>

      </div>

    </button>
  );
};

export default TaskCard;