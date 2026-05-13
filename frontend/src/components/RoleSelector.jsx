export default function RoleSelector({ role, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-400">Role:</span>
      <div className="flex bg-zinc-800 rounded-lg p-0.5 gap-0.5">
        <button
          type="button"
          onClick={() => onChange('Admin')}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
            role === 'Admin'
              ? 'bg-brand-red text-white shadow-md shadow-brand-red/30'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Admin
        </button>
        <button
          type="button"
          onClick={() => onChange('User')}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
            role === 'User'
              ? 'bg-brand-red text-white shadow-md shadow-brand-red/30'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          User
        </button>
      </div>
    </div>
  );
}
