import { useState, useEffect, useCallback } from 'react';
import RoleSelector from '../components/RoleSelector';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import ConfirmModal from '../components/ConfirmModal';
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
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
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

  useEffect(() => {
    if (editingTask) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [editingTask]);

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
    setDeletingTaskId(id);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const data = await deleteTask(deletingTaskId, role);
      setTasks((prev) => prev.filter((t) => t._id !== deletingTaskId));
      showToast(data.message, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setDeletingTaskId(null);
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeletingTaskId(null);
  };

  return (
    <div className="min-h-screen bg-brand-dark">
      <header className="bg-zinc-900/90 backdrop-blur-md shadow-lg shadow-black/20 border-b border-zinc-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-baseline gap-2 sm:gap-3 min-w-0">
            <div className="size-2 bg-brand-red rounded-full animate-pulse-slow shrink-0 self-center shadow-lg shadow-brand-red/40" />
            <h1 className="text-base sm:text-xl font-bold text-white truncate">Task Manager</h1>
            <span className="text-[10px] sm:text-[11px] font-medium px-1.5 sm:px-2.5 py-0.5 bg-brand-red/10 text-brand-red rounded-full border border-brand-red/30 leading-none shrink-0 tracking-wide">
              by Janith Perera
            </span>
          </div>
          <RoleSelector role={role} onChange={setRole} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <TaskForm onSubmit={handleCreate} isEditing={false} />

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-200">
              Tasks
            </h2>
            <span className="text-xs font-medium px-2.5 py-1 bg-brand-red/10 text-brand-red rounded-full border border-brand-red/20">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-zinc-900/80 rounded-xl border border-zinc-800 p-5 animate-pulse">
                  <div className="h-4 bg-zinc-700 rounded w-3/4 mb-3" />
                  <div className="h-3 bg-zinc-700 rounded w-full mb-2" />
                  <div className="h-3 bg-zinc-700 rounded w-2/3 mb-4" />
                  <div className="flex gap-2">
                    <div className="h-3 bg-zinc-700 rounded w-20" />
                    <div className="h-3 bg-zinc-700 rounded w-16" />
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

      {editingTask && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start sm:items-center justify-center z-[60] p-4 overflow-y-auto animate-fade-in">
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

      <ConfirmModal
        isOpen={!!deletingTaskId}
        title="Delete Task"
        message={`Are you sure you want to delete "${tasks.find((t) => t._id === deletingTaskId)?.title || 'this task'}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
