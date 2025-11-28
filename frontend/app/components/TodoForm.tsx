"use client";

import { Button, Group, Stack, Textarea, TextInput } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { FormEvent, useState } from "react";
import type { TodoPayload } from "../services/todos";

interface TodoFormProps {
  loading: boolean;
  onCreate: (payload: TodoPayload) => Promise<void>;
}

export default function TodoForm({ loading, onCreate }: TodoFormProps) {
  const [form, setForm] = useState<TodoPayload>({
    name: "",
    description: "",
    isCompleted: false,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim()) {
      return;
    }

    await onCreate({
      ...form,
      name: form.name.trim(),
    });

    setForm({ name: "", description: "", isCompleted: false });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="sm">
        <Group align="flex-end" grow>
          <TextInput
            label="Name"
            placeholder="Write what needs doing"
            value={form.name}
            onChange={(event) =>
              setForm((previous) => ({
                ...previous,
                name: event.target.value,
              }))
            }
            required
          />
        </Group>

        <Textarea
          label="Details"
          placeholder="Add a short description"
          value={form.description}
          minRows={2}
          onChange={(event) =>
            setForm((previous) => ({
              ...previous,
              description: event.target.value,
            }))
          }
        />

        <Button type="submit" leftSection={<IconPlus size={18} />} loading={loading}>
          Create todo
        </Button>
      </Stack>
    </form>
  );
}
