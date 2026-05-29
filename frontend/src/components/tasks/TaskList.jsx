import TaskCard from "./TaskCard.jsx";

const TaskList = ({ tasks, onOpenTask }) => {
  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white p-8 text-center text-muted-foreground">
        No tasks match your filters.
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onOpen={onOpenTask} />
      ))}
    </div>
  );
};

export default TaskList;
