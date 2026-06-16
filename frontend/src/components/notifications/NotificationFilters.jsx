/*
==================================================
NOTIFICATION FILTERS COMPONENT
--------------------------------------------------
Component:
NotificationFilters

Props:
- readFilter
- onReadFilterChange
- typeFilter
- onTypeFilterChange
- search
- onSearchChange

Purpose:
Provides filtering and search capabilities
for the notifications page.

Used In:
Employee Notifications Page

Features:
- Read Status Filtering
- Notification Type Filtering
- Notification Search
- Responsive Controls

Business Value:
Allows users to quickly locate important
notifications and focus on relevant updates.

Workflow:
1. User selects read status filter
2. User selects notification category
3. User searches notification content
4. Parent component filters notification list

Return:
Notification filter toolbar.
==================================================
*/

/*
==================================================
READ STATUS FILTERS
--------------------------------------------------
Purpose:
Defines available read-state filters.

Options:
- ALL
- UNREAD
- READ

Business Logic:
Used to filter notifications based on
their read/unread status.
==================================================
*/
const READ_FILTERS = [
  "ALL",
  "UNREAD",
  "READ",
];

/*
==================================================
NOTIFICATION TYPE FILTERS
--------------------------------------------------
Purpose:
Defines available notification categories.

Categories:
- All Types
- Task
- Leave
- Attendance
- Shift
- System

Business Logic:
Allows users to narrow notifications
to a specific business domain.
==================================================
*/
const TYPE_FILTERS = [
  {
    value: "ALL",
    label: "All Types",
  },
  {
    value: "Task",
    label: "Task",
  },
  {
    value: "Leave",
    label: "Leave",
  },
  {
    value: "Attendance",
    label: "Attendance",
  },
  {
    value: "Shift",
    label: "Shift",
  },
  {
    value: "System",
    label: "System",
  },
];

/*
==================================================
NOTIFICATION FILTERS
--------------------------------------------------
Component:
NotificationFilters

Purpose:
Provides notification filtering and
search controls.

Features:
- Read Status Selection
- Category Selection
- Search Input

Business Value:
Improves productivity by helping users:
- Find unread notifications
- Focus on specific notification types
- Search large notification histories

Return:
Filter and search toolbar.
==================================================
*/
const NotificationFilters = ({
  readFilter,
  onReadFilterChange,
  typeFilter,
  onTypeFilterChange,
  search,
  onSearchChange,
}) => {
  return (
    <div className="space-y-4">

      {/* ======================================
          TOP FILTER BAR
          --------------------------------------
          Contains:
          - Read Status Filters
          - Search Input
      ====================================== */}
      <div className="flex flex-wrap items-center gap-3">

        {/* ==================================
            READ STATUS FILTERS
        ================================== */}
        <div className="flex flex-wrap gap-2">

          {READ_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => onReadFilterChange(filter)}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                readFilter === filter
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-white text-foreground"
              }`}
            >

              {/* Display User Friendly Label */}
              {filter === "ALL"
                ? "All"
                : filter === "UNREAD"
                ? "Unread"
                : "Read"}

            </button>
          ))}

        </div>

        {/* ==================================
            SEARCH INPUT
        ================================== */}
        <div className="ml-auto w-full sm:w-auto">

          <input
            type="text"
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search notifications"
            className="w-full rounded-full border border-border bg-white px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />

        </div>

      </div>

      {/* ======================================
          TYPE FILTERS
          --------------------------------------
          Filters notifications by business
          category.
      ====================================== */}
      <div className="flex flex-wrap gap-2">

        {TYPE_FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() =>
              onTypeFilterChange(filter.value)
            }
            className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.2em] transition ${
              typeFilter === filter.value
                ? "border-primary/60 bg-primary/10 text-primary"
                : "border-border bg-white text-muted-foreground"
            }`}
          >

            {filter.label}

          </button>
        ))}

      </div>

    </div>
  );
};

export default NotificationFilters;