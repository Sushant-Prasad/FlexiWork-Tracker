/*
==================================================
TASK STATS
--------------------------------------------------
Purpose:
  Renders summary stat cards for task counts
  (Assigned, To Do, In Progress, etc.)

Props:
  - stats: Array<{ label: string, value: number, icon?: ComponentType }>
  - isLoading: boolean
==================================================
*/

const TaskStats = ({ stats, isLoading = false }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="rounded-3xl bg-primary p-6 shadow-[0_8px_24px_rgba(15,23,42,0.12)] card-hover"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-white/75">
                  {item.label}
                </p>
                <p className="mt-3 text-4xl font-bold text-white">
                  {isLoading ? "—" : item.value}
                </p>
              </div>
              {Icon && (
                <div className="rounded-2xl bg-white/15 p-3">
                  <Icon size={22} className="text-white" />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskStats;
