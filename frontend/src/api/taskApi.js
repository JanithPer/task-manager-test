const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getHeaders = (role) => ({
  'Content-Type': 'application/json',
  'x-user-role': role,
});

export async function createTask(taskData, role) {
  const res = await fetch(`${API_URL}/api/tasks`, {
    method: 'POST',
    headers: getHeaders(role),
    body: JSON.stringify(taskData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function getTasks(role) {
  const res = await fetch(`${API_URL}/api/tasks`, {
    headers: getHeaders(role),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function updateTask(id, taskData, role) {
  const res = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: 'PUT',
    headers: getHeaders(role),
    body: JSON.stringify(taskData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function updateTaskStatus(id, status, role) {
  const res = await fetch(`${API_URL}/api/tasks/${id}/status`, {
    method: 'PATCH',
    headers: getHeaders(role),
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function deleteTask(id, role) {
  const res = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: 'DELETE',
    headers: getHeaders(role),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}
