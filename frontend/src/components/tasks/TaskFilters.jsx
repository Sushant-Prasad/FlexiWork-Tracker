const STATUS_FILTERS = ["ALL", "TODO", "IN_PROGRESS", "TESTING", "REVIEW", "DONE"];

const TaskFilters = ({ activeFilter, onFilterChange, search, onSearchChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
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
            {filter === "REVIEW" ? "Review" : filter.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <div className="ml-auto w-full sm:w-auto">
        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search task"
          className="w-full rounded-full border border-border bg-white px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
      </div>
    </div>
  );
};

export default TaskFilters;
