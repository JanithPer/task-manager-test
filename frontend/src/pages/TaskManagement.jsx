import { useState, useEffect, useCallback } from 'react';
import RoleSelector from '../components/RoleSelector';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { useToast } from '../context/ToastContext';
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
  const [isLoading, setIsLoading] = useState(true);
  const showToast = useToast();

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getTasks(role);
      setTasks(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [role, showToast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreate = async (formData) => {
    try {
      const data = await createTask(formData, role);
      setTasks((prev) => [data.task, ...prev]);
      showToast(data.message, 'success');
    } catch (err) {
      showToast(err.message, 'error');
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
      showToast(data.message, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const data = await updateTaskStatus(id, status, role);
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? data.task : t))
      );
      showToast(data.message, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const data = await deleteTask(id, role);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      showToast(data.message, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            <h1 className="text-xl font-bold text-gray-900">Task Manager</h1>
          </div>
          <RoleSelector role={role} onChange={setRole} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <TaskForm onSubmit={handleCreate} isEditing={false} />

        {editingTask && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="w-full max-w-2xl animate-scale-in">
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Tasks
            </h2>
            <span className="text-xs font-medium px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                  <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-4" />
                  <div className="flex gap-2">
                    <div className="h-3 bg-gray-200 rounded w-20" />
                    <div className="h-3 bg-gray-200 rounded w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <TaskList
              tasks={tasks}
              role={role}
              onEdit={handleEdit}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          )}
        </div>
      </main>
    </div>
  );
}
