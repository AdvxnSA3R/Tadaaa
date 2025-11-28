"use client";

import { Center, Container, Loader, Stack, Text, Title } from "@mantine/core";
import TodoCard from "./components/TodoCard";
import TodoForm from "./components/TodoForm";
import { BACKEND_BASE, TodoPayload } from "./services/todos";
import { useTodos } from "./hooks/useTodos";

export default function Home() {
  const {
    todos,
    drafts,
    loading,
    error,
    creating,
    savingId,
    deletingId,
    createTodo,
    saveTodo,
    deleteTodo,
    setDraftValue,
  } = useTodos();

  const handleCreate = async (payload: TodoPayload) => {
    try {
      await createTodo(payload);
    } catch {
      // Error already surfaced by hook
    }
  };

  const handleSave = async (todoId: string) => {
    const draft = drafts[todoId];
    const todo = todos.find((entry) => entry.id === todoId);

    if (!draft || !todo) {
      return;
    }

    try {
      await saveTodo(todoId, {
        name: draft.name,
        description: draft.description,
        isCompleted: todo.isCompleted,
      });
    } catch {
      // Error already surfaced by hook
    }
  };

  const handleToggleCompletion = async (todoId: string) => {
    const draft = drafts[todoId];
    const todo = todos.find((entry) => entry.id === todoId);

    if (!draft || !todo) {
      return;
    }

    try {
      await saveTodo(todoId, {
        name: draft.name,
        description: draft.description,
        isCompleted: !todo.isCompleted,
      });
    } catch {
      // Error already surfaced by hook
    }
  };

  const handleDelete = async (todoId: string) => {
    try {
      await deleteTodo(todoId);
    } catch {
      // Error already surfaced by hook
    }
  };

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Stack gap="xs">
          <Title order={1}>Todos</Title>
          <Text size="sm" color="dimmed">
            Talking to backend at {BACKEND_BASE}
          </Text>
        </Stack>

        {error && <Text color="red">{error}</Text>}

        <Stack gap="sm">
          <TodoForm loading={creating} onCreate={handleCreate} />
        </Stack>

        <Stack gap="sm">
          {loading ? (
            <Center py="xl">
              <Loader />
            </Center>
          ) : todos.length > 0 ? (
            todos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                draft={drafts[todo.id]}
                isSaving={savingId === todo.id}
                isDeleting={deletingId === todo.id}
                onDraftChange={setDraftValue}
                onSave={() => handleSave(todo.id)}
                onToggleCompletion={() => handleToggleCompletion(todo.id)}
                onDelete={() => handleDelete(todo.id)}
              />
            ))
          ) : (
            <Text color="dimmed" ta="center">
              No todos yet — add your first one.
            </Text>
          )}
        </Stack>
      </Stack>
    </Container>
  );
}
