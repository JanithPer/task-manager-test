import { useState, useEffect } from 'react';

const icons = {
  success: (
    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  ),
};

const styles = {
  success: 'bg-zinc-900 border-emerald-700 ring-1 ring-emerald-700/50',
  error: 'bg-zinc-900 border-brand-red ring-1 ring-brand-red/50',
  info: 'bg-zinc-900 border-blue-700 ring-1 ring-blue-700/50',
  warning: 'bg-zinc-900 border-amber-700 ring-1 ring-amber-700/50',
};

export default function Toast({ toast, onRemove }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsExiting(true), toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast.duration]);

  useEffect(() => {
    if (isExiting) {
      const timer = setTimeout(() => onRemove(toast.id), 300);
      return () => clearTimeout(timer);
    }
  }, [isExiting, toast.id, onRemove]);

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-lg border shadow-lg ${
        styles[toast.type]
      } ${isExiting ? 'animate-slide-out' : 'animate-slide-in'}`}
      role="alert"
    >
      <span className="mt-0.5 flex-shrink-0">{icons[toast.type] || icons.info}</span>
      <p className="text-sm font-medium text-gray-200 flex-1">{toast.message}</p>
      <button
        onClick={() => setIsExiting(true)}
        className="flex-shrink-0 text-gray-500 hover:text-gray-300 transition-colors"
        aria-label="Close"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
