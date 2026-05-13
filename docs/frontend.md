# Frontend Architecture

## Overview

The frontend is a **single-page application (SPA)** built with **React 19**, **Vite 8**, and **TailwindCSS 3**. It has no client-side router — all functionality lives at a single URL (`/`). The app is a Task Manager that lets users create, view, edit, delete, and change the status of tasks, with role-based access control (Admin vs User).

---

## Project Structure

```
frontend/
  .env                 # Environment variables (API URL)
  index.html           # SPA entry point (mounts #root)
  package.json         # Dependencies & scripts
  postcss.config.js    # PostCSS with Tailwind + Autoprefixer
  tailwind.config.js   # Tailwind content paths & theme
  tsconfig.json        # TypeScript config (allowJs mode)
  public/
    favicon.svg
    icons.svg
  src/
    main.jsx           # React DOM mount point
    App.jsx            # Root component
    index.css          # Global styles + Tailwind directives
    api/
      taskApi.js       # API client (fetch wrappers)
    components/
      RoleSelector.jsx # Admin/User toggle
      TaskForm.jsx     # Create/Edit form (reusable)
      TaskItem.jsx     # Single task card
      TaskList.jsx     # Grid of TaskItem cards
    pages/
      TaskManagement.jsx  # Main page (state hub)
  dist/                # Vite production build output
```

---

## Entry Point: `main.jsx` & `index.html`

**`index.html`** contains a `<div id="root">` and a `<script>` tag loading `/src/main.jsx`. Vite processes this during dev/build.

**`main.jsx`** mounts the `<App />` component inside React's `<StrictMode>` into the `#root` DOM node:

```jsx
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

---

## Global Styles: `index.css`

Three Tailwind directives followed by a base body style:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-gray-50 text-gray-900;
}
```

---

## Root Component: `App.jsx`

Simply renders the `TaskManagement` page. No providers, no routing, no context.

```jsx
export default function App() {
  return <TaskManagement />;
}
```

---

## Core Page: `TaskManagement.jsx` (State Hub)

This is the **brain of the application**. All state lives here as local `useState` hooks. There is no Redux, Zustand, or Context API.

### State Variables

| Variable       | Type                            | Purpose                                    |
|----------------|---------------------------------|--------------------------------------------|
| `role`         | `'Admin' \| 'User'`             | Current selected role (default: `'Admin'`) |
| `tasks`        | `Task[]`                        | Array of tasks fetched from the API        |
| `editingTask`  | `Task \| null`                  | Task being edited (opens modal)            |
| `message`      | `{ text, type } \| null`        | Flash notification banner                  |
| `loading`      | `boolean`                       | Declared but unused (dead state)           |

### Data Flow

1. **On mount** and whenever `role` changes, `fetchTasks()` is called via `useEffect`.
2. `fetchTasks()` calls `getTasks(role)` from the API layer and updates `tasks` state. Errors display via `showMessage()`.
3. **Creating** a task: `handleCreate()` calls `createTask(formData, role)`, prepends the returned task to `tasks`, and shows a success message.
4. **Editing**: `handleEdit(task)` sets `editingTask` (converting `dueDate` to `YYYY-MM-DD` format), which renders the `TaskForm` inside a modal overlay. On submit, `handleUpdate()` calls `updateTask(id, formData, role)` and replaces the task in the list.
5. **Status change**: `handleStatusChange(id, status)` calls `updateTaskStatus(id, status, role)` and updates that task locally.
6. **Deleting**: `handleDelete(id)` calls `deleteTask(id, role)` after a `confirm()` dialog, then filters the task out of local state.

### UI Layout

```
┌─────────────────────────────────────────────┐
│ Header: "Task Manager"      [Role Selector] │
├─────────────────────────────────────────────┤
│ [Flash Message Banner] (auto-dismiss 4s)    │
├─────────────────────────────────────────────┤
│ TaskForm (Create New Task)                  │
├─────────────────────────────────────────────┤
│ All Tasks (N)                               │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│ │ TaskItem│ │ TaskItem│ │ TaskItem│ ...     │
│ └─────────┘ └─────────┘ └─────────┘        │
├─────────────────────────────────────────────┤
│ [Edit Modal Overlay] (conditional)          │
│   ┌──────────────────────────────────┐      │
│   │ TaskForm (Edit Task)    [Cancel] │      │
│   └──────────────────────────────────┘      │
└─────────────────────────────────────────────┘
```

---

## API Layer: `src/api/taskApi.js`

A thin wrapper around the browser `fetch` API. All five functions follow the same pattern:

```js
export async function functionName(params, role) {
  const res = await fetch(`${API_URL}/api/tasks/...`, {
    method: '...',
    headers: {
      'Content-Type': 'application/json',
      'x-user-role': role,   // <-- role-based auth
    },
    body: ...,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}
```

### Functions & Endpoints

| Function                  | Method | Path                      | Role Auth | Purpose                    |
|---------------------------|--------|---------------------------|-----------|----------------------------|
| `getTasks(role)`          | GET    | `/api/tasks`              | Admin, User | Fetch all tasks          |
| `createTask(taskData, role)` | POST | `/api/tasks`            | Admin, User | Create a new task        |
| `updateTask(id, data, role)` | PUT  | `/api/tasks/:id`         | Admin only | Update all task fields   |
| `updateTaskStatus(id, status, role)` | PATCH | `/api/tasks/:id/status` | Admin, User | Change task status only |
| `deleteTask(id, role)`    | DELETE | `/api/tasks/:id`         | Admin only | Delete a task            |

### API URL Resolution

```js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

- In development, set `VITE_API_URL` in `.env` (points to a Cloud Workstations deployment).
- Falls back to `http://localhost:5000` for local backend development.

### Error Handling

Every function checks `res.ok`. If the backend returns a non-2xx status, it throws an `Error` with the `message` field from the JSON response body. These errors are caught by the handlers in `TaskManagement.jsx` and displayed as red flash messages.

---

## Components

### `RoleSelector.jsx`

A segmented button toggle for switching between **Admin** and **User** roles.

- Props: `role` (current value), `onChange` (setter callback)
- Active button: `bg-indigo-600 text-white`
- Inactive button: `bg-white text-gray-700`
- The selected role is sent as the `x-user-role` header on every API request.
- This is the **only mechanism for authentication** in the app — there is no login page.

### `TaskForm.jsx`

A reusable form for both **creating** and **editing** tasks.

- Props: `onSubmit`, `initialData?`, `onCancel?`, `isEditing`
- When `isEditing === false`:
  - Title: "Create New Task"
  - Form resets to empty after submission
  - No cancel button
- When `isEditing === true`:
  - Title: "Edit Task"
  - Pre-fills with `initialData`
  - Shows a "Cancel" button
  - Used inside a modal overlay

**Form Fields:**

| Field            | Type     | Required | Values                             |
|------------------|----------|----------|------------------------------------|
| Title            | text     | Yes      | —                                  |
| Assigned Person  | text     | Yes      | —                                  |
| Description      | textarea | Yes      | 3 rows                             |
| Priority         | select   | —        | `LOW`, `MEDIUM`, `HIGH`            |
| Status           | select   | —        | `PENDING`, `IN_PROGRESS`, `COMPLETED` |
| Due Date         | date     | Yes      | Native date picker                 |

### `TaskList.jsx`

Renders a responsive grid of `TaskItem` cards.

- **Empty state**: Centered message "No tasks found" with a sub-message "Create a new task to get started."
- **Grid layout**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Props: `tasks`, `role`, `onEdit`, `onStatusChange`, `onDelete`

### `TaskItem.jsx`

An individual task card displaying all task details and actions.

**Visual elements (top to bottom):**
1. **Title** (bold) + **Priority badge** + **Status badge**
   - Priority colors: LOW (green), MEDIUM (yellow), HIGH (red)
   - Status colors: PENDING (gray), IN_PROGRESS (blue), COMPLETED (emerald)
2. **Description** (clamped to 2 lines via `line-clamp-2`)
3. **Assigned person** + **Due date** (formatted as "MMM DD, YYYY")
4. **Action bar** (separated by a border):
   - Status dropdown (always visible for all roles)
   - Edit button (Admin only) — `bg-indigo-50`
   - Delete button (Admin only) — `bg-red-50`

---

## Role-Based Access Control (RBAC)

The app uses a **dual-layer** RBAC approach:

### Layer 1: UI Visibility (Frontend)

- `TaskItem.jsx` conditionally renders Edit and Delete buttons only when `role === 'Admin'`.
- This is purely a UX courtesy — it does not provide security.

### Layer 2: API Authorization (Backend)

- Every API request includes the `x-user-role` header.
- The backend middleware (`roleMiddleware.js`) checks the header against allowed roles for each route.
- Admin-only routes (PUT, DELETE) return 403 if the role is `'User'`.

---

## Configuration Files

### `vite.config.js` (inferred)

Not present as a standalone file — Vite 8 uses zero-config defaults. The `index.html` entry point is automatically detected.

### `tailwind.config.js`

```js
content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]
```

Scans HTML and all source files for Tailwind utility classes. No custom theme extensions.

### `postcss.config.js`

Enables `tailwindcss` and `autoprefixer` PostCSS plugins.

### `tsconfig.json`

TypeScript configuration in **allowJs mode** — allows `.jsx` files to be type-checked. Targets ES2023 with DOM lib. Uses `bundler` module resolution. Strict checks enabled (`noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`). No emit — Vite handles bundling.

### `.env`

```
VITE_API_URL=https://...
```

Vite exposes variables prefixed with `VITE_` to client code via `import.meta.env`.

---

## Build & Dev Scripts

| Command             | Description                          |
|---------------------|--------------------------------------|
| `npm run dev`       | Start Vite dev server with HMR       |
| `npm run build`     | Production build to `dist/`          |
| `npm run preview`   | Preview the production build locally |

---

## Dependencies

| Package       | Version   | Purpose                              |
|---------------|-----------|--------------------------------------|
| `react`       | ^19.2.6   | UI framework                         |
| `react-dom`   | ^19.2.6   | React DOM renderer                   |
| `vite`        | ^8.0.12   | Build tool & dev server              |
| `tailwindcss` | ^3.4.19   | Utility-first CSS framework          |
| `postcss`     | ^8.5.14   | CSS processing pipeline              |
| `autoprefixer`| ^10.5.0   | Vendor prefix autofill               |
| `typescript`  | ~6.0.2    | Type checking                        |

---

## Data Model (Task)

```typescript
interface Task {
  _id: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  dueDate: string;       // ISO date from API
  assignedPerson: string;
  createdAt: string;      // from Mongoose timestamps
  updatedAt: string;      // from Mongoose timestamps
}
```

---

## Summary: Request Lifecycle

```
User clicks "Create Task"
  → TaskForm.handleSubmit()
    → TaskManagement.handleCreate(formData)
      → taskApi.createTask(formData, role)
        → fetch(POST /api/tasks, { headers: { x-user-role } })
          → [Backend: roleMiddleware → taskController → Mongoose → MongoDB]
        ← Response JSON
      ← Task object
    → setTasks([newTask, ...prev])
    → showMessage("Task created successfully", "success")
  → TaskForm resets to empty
  → TaskList re-renders with new task
  → Flash banner shows for 4 seconds
```
