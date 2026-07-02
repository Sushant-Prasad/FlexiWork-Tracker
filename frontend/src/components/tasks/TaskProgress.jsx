/*
==================================================
TASK PROGRESS COMPONENT
--------------------------------------------------
Component:
TaskProgress

Props:
- percent

Purpose:
Displays the overall completion progress
of the employee's assigned tasks or
project using a visual progress bar.

Used In:
Employee Dashboard
My Tasks Page

Data Source:
Derived from completed and total task
statistics.

Related APIs:
GET /api/tasks/me

Features:
- Progress Percentage
- Visual Progress Bar
- Responsive Card Layout

Business Value:
Provides employees with a quick overview
of their current work progress, helping
them monitor productivity and remaining
work at a glance.

Workflow:
1. Receive completion percentage.
2. Display progress value.
3. Render progress bar.
4. Update automatically when task
   completion changes.

Return:
Task progress summary card.
==================================================
*/

const TaskProgress = ({ percent }) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_6px_18px_rgba(15,23,42,0.08)]">

      {/* ======================================
          CARD HEADER
          --------------------------------------
          Displays the title and current
          completion percentage.
      ====================================== */}
      <div className="flex items-center justify-between">

        {/* Progress Title */}
        <h3 className="text-lg font-semibold text-foreground">
          Project Progress
        </h3>

        {/* Progress Percentage */}
        <span className="text-sm font-semibold text-foreground">
          {percent}%
        </span>

      </div>

      {/* ======================================
          PROGRESS BAR
          --------------------------------------
          Visually represents the percentage
          of completed work.

          Business Logic:
          - Width is dynamically calculated
            using the provided percentage.
          - Updates whenever task completion
            changes.
      ====================================== */}
      <div className="mt-4 h-3 w-full rounded-full bg-secondary">

        {/* Filled Progress */}
        <div
          className="h-3 rounded-full bg-primary transition-all duration-500 ease-in-out"
          style={{
            width: `${percent}%`,
          }}
        />

      </div>

    </div>
  );
};

export default TaskProgress;