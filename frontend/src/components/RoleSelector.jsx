export default function RoleSelector({ role, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-500">Role:</span>
      <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
        <button
          type="button"
          onClick={() => onChange('Admin')}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
            role === 'Admin'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Admin
        </button>
        <button
          type="button"
          onClick={() => onChange('User')}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
            role === 'User'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          User
        </button>
      </div>
    </div>
  );
}
