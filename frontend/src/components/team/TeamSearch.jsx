import { Search, X } from "lucide-react";

/*
==================================================
TEAM SEARCH
--------------------------------------------------
Purpose:
  Search input for filtering team members by name
  or email. Controlled — value and onChange come
  from the parent page.

Props:
  - value: string
  - onChange: (val: string) => void
  - resultCount: number
  - totalCount: number
==================================================
*/

const TeamSearch = ({ value, onChange, resultCount, totalCount }) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Search input */}
      <div className="flex flex-1 items-center gap-2.5 rounded-2xl border border-input bg-background px-4 py-2.5 shadow-sm transition focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/20">
        <Search size={16} className="shrink-0 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="shrink-0 text-muted-foreground transition hover:text-foreground"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Result count */}
      <p className="shrink-0 text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-semibold text-foreground">{resultCount}</span> of{" "}
        <span className="font-semibold text-foreground">{totalCount}</span> members
      </p>
    </div>
  );
};

export default TeamSearch;
