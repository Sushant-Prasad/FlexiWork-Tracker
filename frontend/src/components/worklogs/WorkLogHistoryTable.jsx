import { useState } from "react";
import { Search } from "lucide-react";
import { Badge } from "../ui/badge.jsx";

/*
==================================================
WORK LOG HISTORY TABLE
--------------------------------------------------
Purpose:
  Searchable, date-filterable table of work logs
  sorted newest first. Client-side search on date
  and mode. Displays mode badge and hours.

Props:
  - logs: array of work log objects
  - isLoading: boolean
==================================================
*/

const MODE_BADGE = {
  OFFICE: "default",
  REMOTE: "secondary",
  HYBRID: "secondary",
  UNLOGGED: "outline",
};

const MODE_LABEL = {
  OFFICE: "Office",
  REMOTE: "Remote",
  HYBRID: "Hybrid",
  UNLOGGED: "Unlogged",
};

const formatTime = (v) => {
  if (!v) return "—";
  const d = new Date(v);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatDate = (str) => {
  if (!str) return "—";
  return new Date(str + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const SkeletonRow = () => (
  <tr>
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <td key={i} className="py-4 pr-6">
        <div className="h-4 animate-pulse rounded-full bg-muted" />
      </td>
    ))}
  </tr>
);

const HEADERS = ["Date", "Mode", "Check In", "Check Out", "Hours", "Comments"];

const WorkLogHistoryTable = ({ logs, isLoading }) => {
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = [...(logs || [])]
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .filter((l) => {
      const modeMatch = l.actualMode
        ?.toLowerCase()
        .includes(search.toLowerCase());
      const dateMatch = l.date?.includes(search) || modeMatch;
      const fromMatch = !dateFrom || l.date >= dateFrom;
      const toMatch = !dateTo || l.date <= dateTo;
      return dateMatch && fromMatch && toMatch;
    });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-2xl border border-input bg-background px-4 py-2.5">
          <Search size={15} className="shrink-0 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by mode or date..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="rounded-2xl border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="rounded-2xl border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
        />
        {(search || dateFrom || dateTo) && (
          <button
            onClick={() => { setSearch(""); setDateFrom(""); setDateTo(""); }}
            className="rounded-2xl border border-border px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-muted"
          >
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              {HEADERS.map((h) => (
                <th
                  key={h}
                  className="pb-3 pr-6 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground last:pr-0"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <><SkeletonRow /><SkeletonRow /><SkeletonRow /></>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No work logs found.
                </td>
              </tr>
            ) : (
              filtered.map((log) => (
                <tr key={log._id || log.date} className="transition hover:bg-muted/40">
                  <td className="py-4 pr-6 font-medium text-foreground">
                    {formatDate(log.date)}
                  </td>
                  <td className="py-4 pr-6">
                    <Badge variant={MODE_BADGE[log.actualMode] || "outline"}>
                      {MODE_LABEL[log.actualMode] || log.actualMode}
                    </Badge>
                  </td>
                  <td className="py-4 pr-6 text-muted-foreground">
                    {formatTime(log.checkInAt)}
                  </td>
                  <td className="py-4 pr-6 text-muted-foreground">
                    {formatTime(log.checkOutAt)}
                  </td>
                  <td className="py-4 pr-6 text-muted-foreground">
                    {log.workedHours ?? 0} hrs
                  </td>
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

      {!isLoading && (
        <p className="text-xs text-muted-foreground">
          Showing {filtered.length} of {logs?.length ?? 0} logs
        </p>
      )}
    </div>
  );
};

export default WorkLogHistoryTable;
