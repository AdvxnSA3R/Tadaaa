import { useEffect, useMemo, useState } from "react";
import {
  createTodo as createTodoService,
  deleteTodo as deleteTodoService,
  Draft,
  fetchAllTodos,
  Todo,
  TodoPayload,
  updateTodo as updateTodoService,
} from "../services/todos";

interface UseTodosResult {
  todos: Todo[];
  drafts: Record<string, Draft>;
  loading: boolean;
  error: string | null;
  creating: boolean;
  savingId: string | null;
  deletingId: string | null;
  reload: () => Promise<void>;
  setDraftValue: (id: string, field: keyof Draft, value: string) => void;
  createTodo: (payload: TodoPayload) => Promise<Todo>;
  saveTodo: (id: string, payload: TodoPayload) => Promise<Todo>;
  deleteTodo: (id: string) => Promise<void>;
}

export function useTodos(): UseTodosResult {
  const [todosById, setTodosById] = useState<Record<string, Todo>>({});
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const todos = useMemo(() => {
    const list = Object.values(todosById);
    return list.sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted));
  }, [todosById]);

  useEffect(() => {
    void loadTodos();
  }, []);

  const loadTodos = async () => {
    setError(null);
    setLoading(true);

    try {
      const fetched = await fetchAllTodos();
      const normalized: Record<string, Todo> = {};
      fetched.forEach((todo) => {
        normalized[todo.id] = todo;
      });

      setTodosById(normalized);
      setDrafts((previous) => {
        const next: Record<string, Draft> = {};
        fetched.forEach((todo) => {
          next[todo.id] = previous[todo.id] ?? {
            name: todo.name,
            description: todo.description,
          };
        });
        return next;
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const setDraftValue = (id: string, field: keyof Draft, value: string) => {
    setDrafts((previous) => ({
      ...previous,
      [id]: {
        ...previous[id],
        [field]: value,
      },
    }));
  };

  const addOrReplaceTodo = (todo: Todo) => {
    setTodosById((previous) => ({
      ...previous,
      [todo.id]: todo,
    }));
    setDrafts((previous) => ({
      ...previous,
      [todo.id]: {
        name: todo.name,
        description: todo.description,
      },
    }));
  };

  const createTodo = async (payload: TodoPayload) => {
    setCreating(true);
    setError(null);

    try {
      const created = await createTodoService(payload);
      addOrReplaceTodo(created);
      return created;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setCreating(false);
    }
  };

  const saveTodo = async (id: string, payload: TodoPayload) => {
    setSavingId(id);
    setError(null);

    try {
      const updated = await updateTodoService(id, payload);
      addOrReplaceTodo(updated);
      return updated;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setSavingId(null);
    }
  };

  const deleteTodo = async (id: string) => {
    setDeletingId(id);
    setError(null);

    try {
      await deleteTodoService(id);
      setTodosById((previous) => {
        const next = { ...previous };
        delete next[id];
        return next;
      });
      setDrafts((previous) => {
        const next = { ...previous };
        delete next[id];
        return next;
      });
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setDeletingId(null);
    }
  };

  return {
    todos,
    drafts,
    loading,
    error,
    creating,
    savingId,
    deletingId,
    reload: loadTodos,
    setDraftValue,
    createTodo,
    saveTodo,
    deleteTodo,
  };
}
