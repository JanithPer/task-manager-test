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

  const inputClass = "w-full px-3 py-2.5 border border-zinc-700 rounded-lg outline-none text-sm transition-all duration-150 bg-[#111] text-white placeholder:text-zinc-500 hover:border-zinc-500 focus:ring-2 focus:ring-brand-red focus:border-brand-red";
  const labelClass = "block text-sm font-medium text-gray-200 mb-1.5";
  const requiredStar = <span className="text-brand-red ml-0.5">*</span>;

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900/90 rounded-xl shadow-lg shadow-black/30 border border-zinc-800/80 p-6 space-y-5 animate-fade-in">
      <div className="flex items-center gap-2.5 mb-1">
        <div className="w-1 h-7 bg-brand-red rounded-full shadow-sm shadow-brand-red/30" />
        <h2 className="text-lg font-semibold text-white tracking-tight">
          {isEditing ? 'Edit Task' : 'Create New Task'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>
            Title {requiredStar}
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
            Assigned Person {requiredStar}
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
            Description {requiredStar}
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
            placeholder="Describe the task in detail"
            className={`${inputClass} resize-none min-h-[80px]`}
          />
        </div>

        <div>
          <label className={labelClass}>Priority</label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className={`${inputClass} appearance-none bg-[#111] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%239ca3af%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22/%3E%3C/svg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-8 cursor-pointer`}
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
            className={`${inputClass} appearance-none bg-[#111] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%239ca3af%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22/%3E%3C/svg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-8 cursor-pointer`}
          >
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>
            Due Date {requiredStar}
          </label>
          <div className="date-input-wrapper">
            <svg className="date-input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
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
      </div>

      <div className="flex gap-3 pt-1">
        {isEditing ? (
          <>
            <button
              type="submit"
              className="btn-primary"
            >
              Update Task
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            type="submit"
            className="btn-primary"
          >
            Create Task
          </button>
        )}
      </div>
    </form>
  );
}
