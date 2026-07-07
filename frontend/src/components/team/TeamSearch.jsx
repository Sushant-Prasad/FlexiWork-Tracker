import { Search, X } from "lucide-react";

/*
==================================================
TEAM SEARCH COMPONENT
--------------------------------------------------
Component:
TeamSearch

Props:
- value
- onChange
- resultCount
- totalCount

Purpose:
Provides a searchable input for filtering
team members by name or email while
displaying the number of matching results.

Used In:
Employee Team Members Page
Manager Teams Page

Data Source:
GET /api/users/team

Features:
- Live Search
- Clear Search Button
- Result Counter
- Responsive Layout

Business Value:
Allows users to quickly locate team
members without manually browsing the
entire team list, improving usability
for large teams.

Workflow:
1. User enters a search keyword.
2. Parent component filters members.
3. Search results update instantly.
4. Result count is displayed.
5. User can clear the search with one click.

Return:
Responsive team search toolbar.
==================================================
*/

const TeamSearch = ({
  value,
  onChange,
  resultCount,
  totalCount,
}) => {
  return (

    /*
    ==========================================
    SEARCH TOOLBAR
    ------------------------------------------
    Layout:
    Mobile  : Vertical
    Desktop : Horizontal

    Purpose:
    Displays the search box alongside the
    filtered result count.
    ==========================================
    */
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

      {/* ======================================
          SEARCH INPUT
          --------------------------------------
          Allows users to search team
          members by name or email.

          Business Logic:
          Search is controlled by the
          parent component.
      ====================================== */}
      <div className="flex flex-1 items-center gap-2.5 rounded-2xl border border-input bg-background px-4 py-2.5 shadow-sm transition focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/20">

        {/* Search Icon */}
        <Search
          size={16}
          className="shrink-0 text-muted-foreground"
        />

        {/* Search Field */}
        <input
          type="text"
          placeholder="Search by name or email..."
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />

        {/* ==================================
            CLEAR SEARCH BUTTON
            ----------------------------------
            Appears only when a search
            keyword has been entered.

            Business Logic:
            Resets the search field.
        ================================== */}
        {value && (

          <button
            type="button"
            onClick={() => onChange("")}
            className="shrink-0 text-muted-foreground transition hover:text-foreground"
          >

            <X size={15} />

          </button>

        )}

      </div>

      {/* ======================================
          SEARCH RESULT SUMMARY
          --------------------------------------
          Displays the number of matching
          members after filtering.

          Example:
          Showing 8 of 20 members
      ====================================== */}
      <p className="shrink-0 text-sm text-muted-foreground">

        Showing{" "}

        <span className="font-semibold text-foreground">

          {resultCount}

        </span>

        {" "}of{" "}

        <span className="font-semibold text-foreground">

          {totalCount}

        </span>

        {" "}members

      </p>

    </div>
  );
};

export default TeamSearch;