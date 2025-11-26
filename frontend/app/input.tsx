'use client';
import { useState } from 'react';
import { Input, Button, Group } from '@mantine/core';

interface TextInputProps {
  onAddTask: (task: string) => void;
}

export function TextInput({ onAddTask }: TextInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (value.trim()) {
      onAddTask(value.trim());
      setValue('');
    }
  };

  return (
    <Group>
      <Input
        style={{ flex: 1 }}
        size="md"
        radius="md"
        placeholder="Input To-Do Task"
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
        onKeyPress={(event) => {
          if (event.key === 'Enter') {
            handleSubmit();
          }
        }}
      />
      <Button size="md" radius="md" onClick={handleSubmit} color="#006400">Submit</Button>
    </Group>
  );
}