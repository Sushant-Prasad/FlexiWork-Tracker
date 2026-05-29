const TaskProgress = ({ percent }) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_6px_18px_rgba(15,23,42,0.08)]">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Project Progress</h3>
        <span className="text-sm font-semibold text-foreground">{percent}%</span>
      </div>
      <div className="mt-4 h-3 w-full rounded-full bg-secondary">
        <div
          className="h-3 rounded-full bg-primary"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default TaskProgress;
