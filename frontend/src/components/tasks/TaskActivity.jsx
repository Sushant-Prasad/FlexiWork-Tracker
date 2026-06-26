/*
==================================================
TASK ACTIVITY COMPONENT
--------------------------------------------------
Component:
TaskActivity

Props:
- items
- isLoading

Purpose:
Displays the employee's most recent task
activities in a simple timeline/list view.

Used In:
Employee Dashboard
My Tasks Page

Data Source:
Derived from task-related APIs or
activity history.

Related APIs:
GET /api/tasks/me

Features:
- Recent Task Activity
- Loading State
- Empty State
- Responsive Card Layout

Business Value:
Provides employees with a quick overview
of their latest task actions, helping
them keep track of recent progress and
work updates.

Workflow:
1. Receive activity data
2. Show loading placeholder if needed
3. Display empty state when no activity exists
4. Render activity list

Return:
Recent activity card.
==================================================
*/

const TaskActivity = ({
  items,
  isLoading = false,
}) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_6px_18px_rgba(15,23,42,0.08)]">

      {/* ======================================
          CARD HEADER
          --------------------------------------
          Displays the section title.
      ====================================== */}
      <h3 className="text-lg font-semibold text-foreground">
        Recent Activity
      </h3>

      {/* ======================================
          ACTIVITY LIST
          --------------------------------------
          Displays employee's recent task
          activities.
      ====================================== */}
      <ul className="mt-4 space-y-3 text-sm text-muted-foreground">

        {/* ==================================
            LOADING STATE
            ----------------------------------
            Displayed while activity data
            is being fetched.
        ================================== */}
        {isLoading ? (

          <li>
            Loading activity...
          </li>

        ) : items.length === 0 ? (

          /* ==============================
             EMPTY STATE
             ------------------------------
             Displayed when no recent
             activities are available.
          ============================== */
          <li>
            No recent activity yet.
          </li>

        ) : (

          /* ==============================
             ACTIVITY ITEMS
             ------------------------------
             Renders each activity entry
             received from the parent
             component.
          ============================== */
          items.map((activity) => (
            <li key={activity.id}>
              {activity.label}
            </li>
          ))

        )}

      </ul>

    </div>
  );
};

export default TaskActivity;