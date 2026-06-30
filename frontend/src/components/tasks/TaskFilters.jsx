/*
==================================================
TASK FILTERS COMPONENT
--------------------------------------------------
Component:
TaskFilters

Purpose:
Provides filtering and search functionality
for employee tasks.

Used In:
Employee My Tasks Page

Related API:
GET /api/tasks/me

Features:
- Status Filtering
- Task Search
- Responsive Filter Layout

Business Value:
Allows employees to quickly locate tasks
based on their current status or search
keywords, improving productivity and
task management efficiency.

Workflow:
1. User selects a task status filter.
2. User enters a search keyword.
3. Parent component filters the task list.
4. Filtered tasks are displayed.

Return:
Task filter toolbar.
==================================================
*/

/*
==================================================
TASK STATUS FILTERS
--------------------------------------------------
Purpose:
Defines all available task status filters.

Available Filters:
- ALL
- TODO
- IN_PROGRESS
- TESTING
- REVIEW
- DONE

Business Logic:
Used to filter employee tasks according
to their current workflow stage.
==================================================
*/
const STATUS_FILTERS = [
  "ALL",
  "TODO",
  "IN_PROGRESS",
  "TESTING",
  "REVIEW",
  "DONE",
];

/*
==================================================
TASK FILTERS
--------------------------------------------------
Component:
TaskFilters

Props:
- activeFilter
- onFilterChange
- search
- onSearchChange

Purpose:
Provides task filtering controls and
search functionality.

Features:
- Status Filter Buttons
- Search Input
- Responsive Layout

Business Value:
Improves navigation and enables users to
quickly locate relevant tasks without
scrolling through the complete task list.

Return:
Task filter toolbar.
==================================================
*/
const TaskFilters = ({
  activeFilter,
  onFilterChange,
  search,
  onSearchChange,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3">

      {/* ======================================
          STATUS FILTER BUTTONS
          --------------------------------------
          Allows filtering tasks based on
          workflow status.
      ====================================== */}
      <div className="flex flex-wrap gap-2">

        {STATUS_FILTERS.map((filter) => (

          <button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              activeFilter === filter
                ? "border-primary bg-primary text-white"
                : "border-border bg-white text-foreground"
            }`}
          >

            {/* Display User-Friendly Status */}
            {filter === "REVIEW"
              ? "Review"
              : filter.replace(/_/g, " ")}

          </button>

        ))}

      </div>

      {/* ======================================
          TASK SEARCH
          --------------------------------------
          Allows employees to search tasks
          by title, project, or keywords.
      ====================================== */}
      <div className="ml-auto w-full sm:w-auto">

        <input
          type="text"
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Search task"
          className="w-full rounded-full border border-border bg-white px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />

      </div>

    </div>
  );
};

export default TaskFilters;