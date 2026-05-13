const priorityColors = {
  LOW: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-red-100 text-red-800',
};

const statusColors = {
  PENDING: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-emerald-100 text-emerald-800',
};

export default function TaskItem({ task, role, onEdit, onStatusChange, onDelete }) {
  const formattedDate = new Date(task.dueDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900">{task.title}</h3>
        <div className="flex gap-2">
          <span
            className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${priorityColors[task.priority]}`}
          >
            {task.priority}
          </span>
          <span
            className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColors[task.status]}`}
          >
            {task.status === 'IN_PROGRESS' ? 'IN PROGRESS' : task.status}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>

      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
        <span>Assigned: <strong>{task.assignedPerson}</strong></span>
        <span>Due: <strong>{formattedDate}</strong></span>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
          className="text-xs px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="PENDING">PENDING</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>

        {role === 'Admin' && (
          <button
            onClick={() => onEdit(task)}
            className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            Edit
          </button>
        )}

        {role === 'Admin' && (
          <button
            onClick={() => onDelete(task._id)}
            className="text-xs px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
