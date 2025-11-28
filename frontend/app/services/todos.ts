const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";
const API_BASE = `${BACKEND_BASE}/api/v1`;

export type TodoPayload = {
  name: string;
  description: string;
  isCompleted: boolean;
};

export type Todo = TodoPayload & {
  id: string;
};

export type Draft = {
  name: string;
  description: string;
};

async function fetchTodoIds(): Promise<string[]> {
  const response = await fetch(`${API_BASE}/todos`);

  if (!response.ok) {
    throw new Error("Unable to load todo ids");
  }

  return response.json();
}

export async function fetchTodoById(id: string): Promise<Todo> {
  const response = await fetch(`${API_BASE}/todo/${id}`);

  if (!response.ok) {
    throw new Error("Unable to load todo details");
  }

  const payload: TodoPayload = await response.json();
  return { id, ...payload };
}

export async function fetchAllTodos(): Promise<Todo[]> {
  const ids = await fetchTodoIds();
  return Promise.all(ids.map((id) => fetchTodoById(id)));
}

export async function createTodo(payload: TodoPayload): Promise<Todo> {
  const response = await fetch(`${API_BASE}/todo`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Unable to create todo");
  }

  const id: string = await response.json();
  return fetchTodoById(id);
}

export async function updateTodo(id: string, payload: TodoPayload): Promise<Todo> {
  const response = await fetch(`${API_BASE}/todo/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Unable to update todo");
  }

  const updatedPayload: TodoPayload = await response.json();
  return { id, ...updatedPayload };
}

export async function deleteTodo(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/todo/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Unable to delete todo");
  }
}

export { BACKEND_BASE };
