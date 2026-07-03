/*
==================================================
TASK STATISTICS COMPONENT
--------------------------------------------------
Component:
TaskStats

Props:
- stats
- isLoading

Purpose:
Displays high-level task metrics in a
responsive card layout.

Used In:
Employee My Tasks Page
Employee Dashboard

Data Source:
Derived from employee task data.

Related API:
GET /api/tasks/me

Metrics Displayed:
- Assigned Tasks
- Pending Tasks
- In Progress Tasks
- Completed Tasks
(or any metrics passed by parent)

Features:
- KPI Cards
- Responsive Grid
- Loading State
- Dynamic Icons
- Reusable Design

Business Value:
Provides employees with a quick overview
of their current workload and task
completion status, helping them monitor
their daily productivity.

Workflow:
1. Parent computes task statistics.
2. Statistics are passed as props.
3. Component renders KPI cards.
4. Loading placeholders are displayed
   while data is being fetched.

Return:
Responsive task statistics dashboard.
==================================================
*/

const TaskStats = ({
  stats,
  isLoading = false,
}) => {
  return (

    /*
    ==========================================
    TASK STATISTICS GRID
    ------------------------------------------
    Purpose:
    Displays task KPI cards in a
    responsive grid layout.

    Layout:
    Mobile  : 1 Column
    Tablet  : 2 Columns
    Desktop : 4 Columns

    Business Value:
    Gives employees a quick summary of
    their task workload and progress.
    ==========================================
    */
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

      {stats.map((item) => {

        /*
        ======================================
        OPTIONAL KPI ICON
        --------------------------------------
        Displays an icon representing the
        corresponding task metric.
        ======================================
        */
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="rounded-3xl bg-primary p-6 shadow-[0_8px_24px_rgba(15,23,42,0.12)] card-hover"
          >

            {/* ==================================
                CARD CONTENT
            ================================== */}
            <div className="flex items-start justify-between">

              {/* ==============================
                  KPI INFORMATION
              ============================== */}
              <div>

                {/* Metric Label */}
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-white/75">

                  {item.label}

                </p>

                {/* Metric Value */}
                <p className="mt-3 text-4xl font-bold text-white">

                  {isLoading
                    ? "—"
                    : item.value}

                </p>

              </div>

              {/* ==============================
                  KPI ICON
              ============================== */}
              {Icon && (
                <div className="rounded-2xl bg-white/15 p-3">

                  <Icon
                    size={22}
                    className="text-white"
                  />

                </div>
              )}

            </div>

          </div>
        );
      })}

    </div>
  );
};

export default TaskStats;