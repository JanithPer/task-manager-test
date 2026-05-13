import { ToastProvider } from './context/ToastContext';
import TaskManagement from './pages/TaskManagement';

export default function App() {
  return (
    <ToastProvider>
      <TaskManagement />
    </ToastProvider>
  );
}
