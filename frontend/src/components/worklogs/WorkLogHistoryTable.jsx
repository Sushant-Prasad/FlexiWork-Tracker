import { useState } from "react";
import { Search } from "lucide-react";
import { Badge } from "../ui/badge.jsx";

/*
==================================================
WORK LOG HISTORY TABLE
--------------------------------------------------
Component:
WorkLogHistoryTable

Props:
- logs
- isLoading

Purpose:
Displays a searchable and filterable history
of employee work logs in a responsive table.

Used In:
Employee Work Logs Page

Data Source:
GET /api/worklogs/me

Features:
- Search by date or work mode
- Date range filtering
- Loading skeleton
- Empty state
- Responsive table
- Work mode badges
- Check-in & Check-out times
- Worked hours
- Comments preview

Business Value:
Allows employees to review historical work
logs, verify attendance records, and quickly
locate specific work entries.

Workflow:
1. Receive work log history.
2. Sort logs by newest date.
3. Apply search filter.
4. Apply date range filter.
5. Render filtered work logs.
6. Display result count.

Return:
Responsive work log history table.
==================================================
*/

/*
==================================================
WORK MODE BADGE MAPPING
--------------------------------------------------
Purpose:
Maps each work mode to its corresponding
Badge variant.

Business Logic:
Keeps badge styling centralized.
==================================================
*/
const MODE_BADGE = {
  OFFICE: "default",
  REMOTE: "secondary",
  HYBRID: "secondary",
  UNLOGGED: "outline",
};

/*
==================================================
WORK MODE LABELS
--------------------------------------------------
Purpose:
Provides user-friendly labels for work
mode values returned by the backend.
==================================================
*/
const MODE_LABEL = {
  OFFICE: "Office",
  REMOTE: "Remote",
  HYBRID: "Hybrid",
  UNLOGGED: "Unlogged",
};

/*
==================================================
FORMAT TIME
--------------------------------------------------
Purpose:
Formats ISO timestamps into a readable
12-hour time.

Parameters:
- value : ISO Date String

Returns:
Formatted time or placeholder.
==================================================
*/
const formatTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
};

/*
==================================================
FORMAT DATE
--------------------------------------------------
Purpose:
Formats YYYY-MM-DD into a readable
Indian date format.

Parameters:
- dateString

Returns:
Formatted date.
==================================================
*/
const formatDate = (dateString) => {
  if (!dateString) return "—";

  return new Date(dateString + "T00:00:00")
    .toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
};

/*
==================================================
SKELETON ROW
--------------------------------------------------
Purpose:
Displays loading placeholders while work
logs are being fetched.

Business Logic:
Improves perceived loading performance.
==================================================
*/
const SkeletonRow = () => (
  <tr>
    {[1, 2, 3, 4, 5, 6].map((column) => (
      <td
        key={column}
        className="py-4 pr-6"
      >
        <div className="h-4 animate-pulse rounded-full bg-muted" />
      </td>
    ))}
  </tr>
);

/*
==================================================
TABLE HEADERS
--------------------------------------------------
Purpose:
Centralized table header labels.

Business Logic:
Keeps presentation configurable.
==================================================
*/
const HEADERS = [
  "Date",
  "Mode",
  "Check In",
  "Check Out",
  "Hours",
  "Comments",
];

/*
==================================================
WORK LOG HISTORY TABLE
--------------------------------------------------
Component:
WorkLogHistoryTable

Props:
- logs
- isLoading

Purpose:
Displays employee work log history with
searching and date filtering.

Return:
Responsive table.
==================================================
*/
const WorkLogHistoryTable = ({
  logs,
  isLoading,
}) => {

  /*
  ==========================================
  FILTER STATES
  ------------------------------------------
  search:
  Text search by date or work mode.

  dateFrom:
  Start date filter.

  dateTo:
  End date filter.
  ==========================================
  */
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  /*
  ==========================================
  FILTERED WORK LOGS
  ------------------------------------------
  Purpose:
  Applies:

  • Descending date sort
  • Search filter
  • Date range filter

  Business Value:
  Helps employees quickly locate
  historical work logs.
  ==========================================
  */
  const filtered = [...(logs || [])]
    .sort((a, b) =>
      (b.date || "").localeCompare(a.date || "")
    )
    .filter((log) => {

      const modeMatch = log.actualMode
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const searchMatch =
        log.date?.includes(search) || modeMatch;

      const fromMatch =
        !dateFrom || log.date >= dateFrom;

      const toMatch =
        !dateTo || log.date <= dateTo;

      return (
        searchMatch &&
        fromMatch &&
        toMatch
      );
    });

  return (
    <div className="space-y-4">

      {/* ======================================
          SEARCH & FILTER SECTION
          --------------------------------------
          Allows filtering work logs by:
          - Search text
          - From date
          - To date
      ====================================== */}
      <div className="flex flex-wrap items-center gap-3">

        {/* Search */}
        <div className="flex flex-1 items-center gap-2 rounded-2xl border border-input bg-background px-4 py-2.5">

          <Search
            size={15}
            className="shrink-0 text-muted-foreground"
          />

          <input
            type="text"
            placeholder="Search by mode or date..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />

        </div>

        {/* From Date */}
        <input
          type="date"
          value={dateFrom}
          onChange={(e) =>
            setDateFrom(e.target.value)
          }
          className="rounded-2xl border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
        />

        {/* To Date */}
        <input
          type="date"
          value={dateTo}
          onChange={(e) =>
            setDateTo(e.target.value)
          }
          className="rounded-2xl border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
        />

        {/* Clear Filters */}
        {(search || dateFrom || dateTo) && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setDateFrom("");
              setDateTo("");
            }}
            className="rounded-2xl border border-border px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-muted"
          >
            Clear
          </button>
        )}

      </div>

      {/* ======================================
          WORK LOG TABLE
          --------------------------------------
          Displays filtered work logs.
      ====================================== */}
      <div className="overflow-x-auto">

        <table className="w-full text-left text-sm">

          {/* Table Header */}
          <thead>

            <tr className="border-b border-border">

              {HEADERS.map((header) => (

                <th
                  key={header}
                  className="pb-3 pr-6 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground last:pr-0"
                >
                  {header}
                </th>

              ))}

            </tr>

          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-border">

            {/* Loading */}
            {isLoading ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : filtered.length === 0 ? (

              /* Empty State */
              <tr>

                <td
                  colSpan={6}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  No work logs found.
                </td>

              </tr>

            ) : (

              /* Work Log Rows */
              filtered.map((log) => (

                <tr
                  key={log._id || log.date}
                  className="transition hover:bg-muted/40"
                >

                  {/* Date */}
                  <td className="py-4 pr-6 font-medium text-foreground">
                    {formatDate(log.date)}
                  </td>

                  {/* Work Mode */}
                  <td className="py-4 pr-6">

                    <Badge
                      variant={
                        MODE_BADGE[log.actualMode] ||
                        "outline"
                      }
                    >
                      {MODE_LABEL[log.actualMode] ||
                        log.actualMode}
                    </Badge>

                  </td>

                  {/* Check In */}
                  <td className="py-4 pr-6 text-muted-foreground">
                    {formatTime(log.checkInAt)}
                  </td>

                  {/* Check Out */}
                  <td className="py-4 pr-6 text-muted-foreground">
                    {formatTime(log.checkOutAt)}
                  </td>

                  {/* Worked Hours */}
                  <td className="py-4 pr-6 text-muted-foreground">
                    {log.workedHours ?? 0} hrs
                  </td>

                  {/* Comments */}
                  <td className="max-w-[160px] py-4">

                    <p className="truncate text-muted-foreground">
                      {log.comments || "—"}
                    </p>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* ======================================
          RESULT SUMMARY
          --------------------------------------
          Displays number of filtered records
          compared to total work logs.
      ====================================== */}
      {!isLoading && (
        <p className="text-xs text-muted-foreground">
          Showing{" "}
          <strong>{filtered.length}</strong>{" "}
          of{" "}
          <strong>{logs?.length ?? 0}</strong>{" "}
          logs
        </p>
      )}

    </div>
  );
};

export default WorkLogHistoryTable;