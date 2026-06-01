const READ_FILTERS = ["ALL", "UNREAD", "READ"];

const TYPE_FILTERS = [
  { value: "ALL", label: "All Types" },
  { value: "Task", label: "Task" },
  { value: "Leave", label: "Leave" },
  { value: "Attendance", label: "Attendance" },
  { value: "Shift", label: "Shift" },
  { value: "System", label: "System" },
];

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
      <div className="flex flex-wrap items-center gap-3">
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
              {filter === "ALL" ? "All" : filter === "UNREAD" ? "Unread" : "Read"}
            </button>
          ))}
        </div>

        <div className="ml-auto w-full sm:w-auto">
          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search notifications"
            className="w-full rounded-full border border-border bg-white px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {TYPE_FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => onTypeFilterChange(filter.value)}
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
