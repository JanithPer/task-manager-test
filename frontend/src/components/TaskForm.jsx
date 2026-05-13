import { useState } from 'react';

const emptyForm = {
  title: '',
  description: '',
  priority: 'LOW',
  status: 'PENDING',
  dueDate: '',
  assignedPerson: '',
};

export default function TaskForm({ onSubmit, initialData, onCancel, isEditing }) {
  const [form, setForm] = useState(initialData || { ...emptyForm });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    if (!isEditing) setForm({ ...emptyForm });
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm transition-all duration-150 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
        <h2 className="text-lg font-semibold text-gray-800">
          {isEditing ? 'Edit Task' : 'Create New Task'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Enter task title"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Assigned Person <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="assignedPerson"
            value={form.assignedPerson}
            onChange={handleChange}
            required
            placeholder="Who is responsible?"
            className={inputClass}
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
            placeholder="Describe the task in detail"
            className={`${inputClass} resize-none`}
          />
        </div>

        <div>
          <label className={labelClass}>Priority</label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>
            Due Date <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        {isEditing ? (
          <>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all duration-150 active:scale-[0.98]"
            >
              Update Task
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-all duration-150 active:scale-[0.98]"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all duration-150 active:scale-[0.98]"
          >
            Create Task
          </button>
        )}
      </div>
    </form>
  );
}
