const TaskStats = ({ stats }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-border bg-card p-5 shadow-[0_8px_20px_rgba(15,23,42,0.08)]"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {item.label}
          </p>
          <p className="mt-3 text-2xl font-semibold text-foreground">{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default TaskStats;
