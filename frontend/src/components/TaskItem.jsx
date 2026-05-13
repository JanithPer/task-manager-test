const priorityColors = {
  LOW: 'bg-green-900/40 text-green-400 border border-green-800/40',
  MEDIUM: 'bg-yellow-900/40 text-yellow-400 border border-yellow-800/40',
  HIGH: 'bg-red-900/40 text-red-400 border border-red-800/40',
};

const statusColors = {
  PENDING: 'bg-zinc-700 text-zinc-300 border border-zinc-600',
  IN_PROGRESS: 'bg-blue-900/40 text-blue-400 border border-blue-800/40',
  COMPLETED: 'bg-emerald-900/40 text-emerald-400 border border-emerald-800/40',
};

const priorityBorders = {
  LOW: 'border-l-green-600',
  MEDIUM: 'border-l-yellow-600',
  HIGH: 'border-l-brand-red',
};

function getDueDateInfo(dueDate) {
  const now = new Date();
  const due = new Date(dueDate);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const diffTime = dueDay - today;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const formatted = due.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  if (diffDays < 0) {
    return { text: `Overdue by ${Math.abs(diffDays)}d`, className: 'text-red-400', formatted };
  }
  if (diffDays === 0) {
    return { text: 'Due today', className: 'text-amber-400 font-semibold', formatted };
  }
  if (diffDays === 1) {
    return { text: 'Due tomorrow', className: 'text-amber-400', formatted };
  }
  return { text: `${diffDays}d left`, className: 'text-gray-400', formatted };
}

export default function TaskItem({ task, role, onEdit, onStatusChange, onDelete }) {
  const dueInfo = getDueDateInfo(task.dueDate);

  return (
      <div className={`card-hover border-l-4 ${priorityBorders[task.priority] || 'border-l-zinc-600'}`}>
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-base font-semibold text-gray-100 leading-snug">{task.title}</h3>
          <div className="flex gap-1.5 flex-shrink-0 ml-2">
            <span className={`badge ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{task.description}</p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 mb-4">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {task.assignedPerson}
          </span>
          <span className={`flex items-center gap-1 ${dueInfo.className}`}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {dueInfo.formatted}
          </span>
          <span className={`badge ${statusColors[task.status]}`}>
            {task.status === 'IN_PROGRESS' ? 'IN PROGRESS' : task.status}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-zinc-800">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value)}
            className="text-xs px-2 py-1.5 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-brand-red outline-none bg-[#111] text-gray-200 cursor-pointer appearance-none pr-6 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%239ca3af%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22/%3E%3C/svg%3E')] bg-[length:1rem] bg-[right_0.25rem_center] bg-no-repeat hover:border-zinc-500 transition-colors"
          >
            <option value="PENDING">PENDING</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>

          <div className="flex-1" />

          {role === 'Admin' && (
            <>
              <button
                onClick={() => onEdit(task)}
                className="p-1.5 text-brand-red hover:bg-brand-red/10 rounded-lg transition-colors"
                title="Edit task"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(task._id)}
                className="p-1.5 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                title="Delete task"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
  );
}
