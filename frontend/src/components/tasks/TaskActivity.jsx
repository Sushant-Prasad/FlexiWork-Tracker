const TaskActivity = ({ items, isLoading = false }) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_6px_18px_rgba(15,23,42,0.08)]">
      <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
      <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
        {isLoading ? (
          <li>Loading activity...</li>
        ) : items.length === 0 ? (
          <li>No recent activity yet.</li>
        ) : (
          items.map((activity) => <li key={activity.id}>{activity.label}</li>)
        )}
      </ul>
    </div>
  );
};

export default TaskActivity;
