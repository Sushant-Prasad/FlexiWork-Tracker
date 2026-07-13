import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/*
==================================================
WORK LOG CALENDAR COMPONENT
--------------------------------------------------
Component:
WorkLogCalendar

Props:
- logs
- isLoading

Purpose:
Displays a compact monthly calendar that
visualizes employee work logs by
highlighting each day based on the
recorded work mode.

Used In:
Employee Work Logs Page
Employee Dashboard

Data Source:
GET /api/worklogs/me

Features:
- Monthly Calendar View
- Month Navigation
- Work Mode Indicators
- Today Highlight
- Loading Skeleton
- Work Mode Legend
- Responsive Layout

Work Modes:
- OFFICE
- REMOTE
- HYBRID
- UNLOGGED

Business Value:
Provides employees with an easy-to-read
monthly overview of their attendance
pattern and work location history.

Workflow:
1. Fetch work log history.
2. Convert logs into a date lookup map.
3. Generate monthly calendar grid.
4. Highlight work modes for each day.
5. Allow month navigation.
6. Display legend explaining colors.

Return:
Interactive work log calendar.
==================================================
*/

/*
==================================================
DAY LABELS
--------------------------------------------------
Purpose:
Defines abbreviated weekday labels used
in the calendar header.

Business Logic:
Maintains a consistent calendar layout.
==================================================
*/
const DAY_LABELS = [
  "Su",
  "Mo",
  "Tu",
  "We",
  "Th",
  "Fr",
  "Sa",
];

/*
==================================================
WORK MODE STYLES
--------------------------------------------------
Purpose:
Maps each work mode to its corresponding
calendar cell and legend styles.

Work Modes:
- OFFICE
- REMOTE
- HYBRID
- UNLOGGED

Business Logic:
Keeps styling centralized and easy to
maintain.
==================================================
*/
const MODE_STYLE = {
  OFFICE: {
    cell: "bg-primary text-white",
    dot: "bg-primary",
  },
  REMOTE: {
    cell: "bg-accent text-white",
    dot: "bg-accent",
  },
  HYBRID: {
    cell: "bg-primary/40 text-white",
    dot: "bg-primary/40",
  },
  UNLOGGED: {
    cell: "bg-destructive/15 text-destructive",
    dot: "bg-destructive/40",
  },
};

/*
==================================================
MONTH NAMES
--------------------------------------------------
Purpose:
Provides month names for the calendar
navigation header.
==================================================
*/
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/*
==================================================
CALENDAR LEGEND
--------------------------------------------------
Purpose:
Defines legend items shown below the
calendar.

Business Logic:
Explains the meaning of each calendar
color indicator.
==================================================
*/
const LEGEND = [
  {
    mode: "OFFICE",
    label: "Office",
  },
  {
    mode: "REMOTE",
    label: "Remote",
  },
  {
    mode: "HYBRID",
    label: "Hybrid",
  },
  {
    mode: "UNLOGGED",
    label: "Absent",
  },
];

/*
==================================================
WORK LOG CALENDAR
--------------------------------------------------
Component:
WorkLogCalendar

Props:
- logs
- isLoading

Purpose:
Displays a monthly calendar with work
mode visualization.

Return:
Interactive monthly calendar.
==================================================
*/
const WorkLogCalendar = ({
  logs,
  isLoading,
}) => {

  /*
  ==========================================
  CURRENT DATE
  ------------------------------------------
  Purpose:
  Initializes the calendar with the
  current month and year.
  ==========================================
  */
  const today = new Date();

  /*
  ==========================================
  CALENDAR STATE
  ------------------------------------------
  viewYear:
  Current year being displayed.

  viewMonth:
  Current month being displayed.
  ==========================================
  */
  const [viewYear, setViewYear] = useState(
    today.getFullYear()
  );

  const [viewMonth, setViewMonth] = useState(
    today.getMonth()
  );

  /*
  ==========================================
  WORK LOG LOOKUP MAP
  ------------------------------------------
  Purpose:
  Converts work log history into an
  object for O(1) lookup.

  Format:
  {
      "2026-07-15": "REMOTE",
      "2026-07-16": "OFFICE"
  }

  Business Value:
  Improves rendering performance by
  avoiding repeated array searches.
  ==========================================
  */
  const logMap = useMemo(() => {

    const map = {};

    (logs || []).forEach((log) => {

      if (log.date) {
        map[log.date] = log.actualMode;
      }

    });

    return map;

  }, [logs]);

  /*
  ==========================================
  CALENDAR GRID
  ------------------------------------------
  Purpose:
  Generates all calendar cells for the
  selected month, including empty cells
  before and after the month.

  Business Logic:
  Maintains a proper 7-column calendar
  layout.
  ==========================================
  */
  const cells = useMemo(() => {

    const firstDay = new Date(
      viewYear,
      viewMonth,
      1
    ).getDay();

    const daysInMonth = new Date(
      viewYear,
      viewMonth + 1,
      0
    ).getDate();

    const grid = [];

    for (let i = 0; i < firstDay; i++) {
      grid.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      grid.push(day);
    }

    while (grid.length % 7 !== 0) {
      grid.push(null);
    }

    return grid;

  }, [viewYear, viewMonth]);

  /*
  ==========================================
  PREVIOUS MONTH
  ------------------------------------------
  Purpose:
  Navigates to the previous month.

  Business Logic:
  Automatically updates the year when
  moving from January to December.
  ==========================================
  */
  const prevMonth = () => {

    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((year) => year - 1);
    } else {
      setViewMonth((month) => month - 1);
    }

  };

  /*
  ==========================================
  NEXT MONTH
  ------------------------------------------
  Purpose:
  Navigates to the next month.

  Business Logic:
  Automatically updates the year when
  moving from December to January.
  ==========================================
  */
  const nextMonth = () => {

    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((year) => year + 1);
    } else {
      setViewMonth((month) => month + 1);
    }

  };

  /*
  ==========================================
  TODAY'S DATE
  ------------------------------------------
  Purpose:
  Used for highlighting today's date.
  ==========================================
  */
  const todayStr = today
    .toISOString()
    .split("T")[0];

  /*
  ==========================================
  LOADING STATE
  ------------------------------------------
  Displays a loading placeholder while
  work log data is being fetched.
  ==========================================
  */
  if (isLoading) {
    return (
      <div className="h-48 animate-pulse rounded-2xl bg-muted" />
    );
  }

  return (
    <div className="select-none">

      {/* ======================================
          CALENDAR NAVIGATION
          --------------------------------------
          Allows users to navigate between
          months.
      ====================================== */}
      <div className="mb-3 flex items-center justify-between">

        <button
          type="button"
          onClick={prevMonth}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:bg-muted"
        >
          <ChevronLeft size={14} />
        </button>

        <p className="text-xs font-semibold text-foreground">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </p>

        <button
          type="button"
          onClick={nextMonth}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:bg-muted"
        >
          <ChevronRight size={14} />
        </button>

      </div>

      {/* ======================================
          WEEKDAY LABELS
      ====================================== */}
      <div className="mb-1 grid grid-cols-7">

        {DAY_LABELS.map((day) => (

          <div
            key={day}
            className="py-0.5 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {day}
          </div>

        ))}

      </div>

      {/* ======================================
          CALENDAR GRID
          --------------------------------------
          Displays all calendar days and
          highlights work modes.
      ====================================== */}
      <div className="grid grid-cols-7 gap-0.5">

        {cells.map((day, index) => {

          if (!day) {
            return (
              <div
                key={`empty-${index}`}
                className="h-7 w-7"
              />
            );
          }

          const month = String(viewMonth + 1).padStart(2, "0");

          const dateStr =
            `${viewYear}-${month}-${String(day).padStart(2, "0")}`;

          const mode = logMap[dateStr];

          const style = mode
            ? MODE_STYLE[mode]
            : null;

          const isToday =
            dateStr === todayStr;

          return (

            <div
              key={dateStr}
              title={
                mode
                  ? mode.toLowerCase()
                  : undefined
              }
              className={`
                mx-auto flex h-7 w-7 items-center justify-center rounded-md text-[11px] font-medium transition
                ${style ? style.cell : "text-foreground hover:bg-muted"}
                ${isToday && !style ? "ring-1 ring-primary ring-offset-1 font-bold" : ""}
              `}
            >
              {day}
            </div>

          );

        })}

      </div>

      {/* ======================================
          CALENDAR LEGEND
          --------------------------------------
          Explains the meaning of each work
          mode color displayed in the
          calendar.
      ====================================== */}
      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-border pt-3">

        {LEGEND.map(({
          mode,
          label,
        }) => (

          <div
            key={mode}
            className="flex items-center gap-1.5"
          >

            <div
              className={`h-2.5 w-2.5 shrink-0 rounded-sm ${MODE_STYLE[mode].dot}`}
            />

            <span className="text-[11px] text-muted-foreground">
              {label}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
};

export default WorkLogCalendar;