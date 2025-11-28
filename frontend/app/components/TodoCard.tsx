"use client";

import {
  ActionIcon,
  Checkbox,
  Group,
  Paper,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconCheck, IconTrash } from "@tabler/icons-react";
import type { Draft, Todo } from "../services/todos";

interface TodoCardProps {
  todo: Todo;
  draft?: Draft;
  isSaving: boolean;
  isDeleting: boolean;
  onDraftChange: (id: string, field: keyof Draft, value: string) => void;
  onSave: () => Promise<void>;
  onToggleCompletion: () => Promise<void>;
  onDelete: () => Promise<void>;
}

export default function TodoCard({
  todo,
  draft,
  isSaving,
  isDeleting,
  onDraftChange,
  onSave,
  onToggleCompletion,
  onDelete,
}: TodoCardProps) {
  return (
    <Paper p="md" shadow="xs" radius="md" withBorder>
      <Stack gap="sm">
        <Group justify="space-between" align="center">
          <Group align="center" gap="xs">
            <Checkbox
              checked={todo.isCompleted}
              onChange={() => void onToggleCompletion()}
              radius="xs"
            />
            <Text fw={600}>{draft?.name ?? todo.name}</Text>
          </Group>

          <Group gap="xs">
            <ActionIcon
              color="green"
              disabled={isSaving}
              onClick={() => void onSave()}
            >
              <IconCheck size={18} />
            </ActionIcon>
            <ActionIcon
              color="red"
              disabled={isDeleting}
              onClick={() => void onDelete()}
            >
              <IconTrash size={18} />
            </ActionIcon>
          </Group>
        </Group>

        <TextInput
          value={draft?.name ?? todo.name}
          onChange={(event) =>
            onDraftChange(todo.id, "name", event.target.value)
          }
          label="Name"
          disabled={isSaving || isDeleting}
        />

        <Textarea
          value={draft?.description ?? todo.description}
          minRows={2}
          label="Details"
          onChange={(event) =>
            onDraftChange(todo.id, "description", event.target.value)
          }
          disabled={isSaving || isDeleting}
        />
      </Stack>
    </Paper>
  );
}
