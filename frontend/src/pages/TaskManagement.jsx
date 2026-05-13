import { useState, useEffect, useCallback } from 'react';
import RoleSelector from '../components/RoleSelector';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import {
  createTask,
  getTasks,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from '../api/taskApi';

export default function TaskManagement() {
  const [role, setRole] = useState('Admin');
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const fetchTasks = useCallback(async () => {
    try {
      const data = await getTasks(role);
      setTasks(data);
    } catch (err) {
      showMessage(err.message, 'error');
    }
  }, [role]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreate = async (formData) => {
    try {
      const data = await createTask(formData, role);
      setTasks((prev) => [data.task, ...prev]);
      showMessage(data.message, 'success');
    } catch (err) {
      showMessage(err.message, 'error');
    }
  };

  const handleEdit = (task) => {
    setEditingTask({
      ...task,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
    });
  };

  const handleUpdate = async (formData) => {
    try {
      const data = await updateTask(editingTask._id, formData, role);
      setTasks((prev) =>
        prev.map((t) => (t._id === editingTask._id ? data.task : t))
      );
      setEditingTask(null);
      showMessage(data.message, 'success');
    } catch (err) {
      showMessage(err.message, 'error');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const data = await updateTaskStatus(id, status, role);
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? data.task : t))
      );
      showMessage(data.message, 'success');
    } catch (err) {
      showMessage(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      const data = await deleteTask(id, role);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      showMessage(data.message, 'success');
    } catch (err) {
      showMessage(err.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Task Manager</h1>
          <RoleSelector role={role} onChange={setRole} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {message && (
          <div
            className={`px-4 py-3 rounded-lg text-sm font-medium ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <TaskForm
          onSubmit={handleCreate}
          isEditing={false}
        />

        {editingTask && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-2xl">
              <TaskForm
                onSubmit={handleUpdate}
                initialData={editingTask}
                onCancel={() => setEditingTask(null)}
                isEditing
              />
            </div>
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            All Tasks ({tasks.length})
          </h2>
          <TaskList
            tasks={tasks}
            role={role}
            onEdit={handleEdit}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        </div>
      </main>
    </div>
  );
}
