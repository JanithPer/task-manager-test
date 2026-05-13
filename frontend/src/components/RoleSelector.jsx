export default function RoleSelector({ role, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-gray-600">Role:</label>
      <div className="flex rounded-lg overflow-hidden border border-gray-300">
        <button
          type="button"
          onClick={() => onChange('Admin')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            role === 'Admin'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Admin
        </button>
        <button
          type="button"
          onClick={() => onChange('User')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            role === 'User'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          User
        </button>
      </div>
    </div>
  );
}
