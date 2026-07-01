import TaskCard from "./TaskCard.jsx";

/*
==================================================
TASK LIST COMPONENT
--------------------------------------------------
Component:
TaskList

Props:
- tasks
- onOpenTask

Purpose:
Displays a collection of task cards for
the logged-in employee.

Used In:
Employee My Tasks Page

Child Components:
- TaskCard

Related API:
GET /api/tasks/me

Features:
- Responsive Task Grid
- Empty State
- Task Selection
- Reusable Card Layout

Business Value:
Provides employees with a structured view
of all assigned tasks, allowing quick
access to task details and status updates.

Workflow:
1. Receive filtered task list from parent.
2. Check whether tasks exist.
3. Show empty state when no tasks match.
4. Render TaskCard for each task.
5. Notify parent when a task is selected.

Return:
Responsive grid of task cards.
==================================================
*/

const TaskList = ({
  tasks,
  onOpenTask,
}) => {

  /*
  ==========================================
  EMPTY STATE
  ------------------------------------------
  Purpose:
  Displays a friendly message when no
  tasks are available after applying
  filters or search criteria.

  Business Logic:
  Improves user experience by informing
  users that no matching tasks exist,
  rather than showing an empty page.
  ==========================================
  */
  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white p-8 text-center text-muted-foreground">

        No tasks match your filters.

      </div>
    );
  }

  /*
  ==========================================
  TASK GRID
  ------------------------------------------
  Purpose:
  Displays employee tasks using reusable
  TaskCard components.

  Layout:
  Mobile  : Single Column
  Desktop : Two Columns

  Business Value:
  Presents task information in a clean,
  responsive layout while allowing users
  to quickly open task details.
  ==========================================
  */
  return (
    <div className="grid gap-4 lg:grid-cols-2">

      {tasks.map((task) => (

        <TaskCard
          key={task.id}

          /*
          ==============================
          TASK DATA
          ==============================
          */
          task={task}

          /*
          ==============================
          TASK OPEN HANDLER
          ------------------------------
          Triggered when a task card is
          selected by the employee.

          Parent Component:
          Opens the Task Details Modal.
          ==============================
          */
          onOpen={onOpenTask}
        />

      ))}

    </div>
  );
};

export default TaskList;