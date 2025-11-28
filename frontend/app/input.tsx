'use client';
import { TextInput, Textarea, Button, Group, ActionIcon, Collapse } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

export function InputWithButton({ handlers }: { handlers: any }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const handleSubmit = () => {
    if (name.trim() !== '') {
      handlers.append({ name, description, date, key: Math.random().toString(), pinned: false });
      setName('');
      setDescription('');
      setDate(null);
      close();
    }
  };

  return (
    <div onFocus={open} onBlur={() => !name && !description && !date && close()}>
      <Group>
        <TextInput
          style={{ flex: 1 }}
          size="md"
          radius="md"
          placeholder="Add a new todo"
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
        />
        <ActionIcon size="lg" radius="md" onClick={handleSubmit}>
          <IconPlus />
        </ActionIcon>
      </Group>
      <Collapse in={opened}>
        <Textarea
          mt="md"
          size="md"
          radius="md"
          placeholder="Description"
          value={description}
          onChange={(event) => setDescription(event.currentTarget.value)}
        />
        <DatePickerInput
          mt="md"
          size="md"
          radius="md"
          placeholder="Due date"
          value={date}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          onChange={setDate}
        />
      </Collapse>
    </div>
  );
}