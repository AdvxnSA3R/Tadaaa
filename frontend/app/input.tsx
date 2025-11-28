'use client'; // Next.js directive: ensures this component runs on the client side

import { useState } from 'react';
import { Input, Button, Group } from '@mantine/core'; // Mantine UI components

// Props definition: parent passes a callback to add a new task
interface TextInputProps {
  onAddTask: (task: string) => void;
}

// TextInput component: allows user to type and submit a new task
export function TextInput({ onAddTask }: TextInputProps) {
  // Local state to hold the current input value
  const [value, setValue] = useState('');

  // Function to handle submission (via button click or Enter key)
  const handleSubmit = () => {
    // Only add task if input is not empty/whitespace
    if (value.trim()) {
      onAddTask(value.trim()); // Call parent callback with the new task
      setValue('');            // Clear input field after submission
    }
  };

  return (
    // Mantine Group: arranges input and button side by side
    <Group>
      <Input
        style={{ flex: 1 }}          // Input expands to fill available space
        size="md"                    // Medium size input
        radius="md"                  // Rounded corners
        placeholder="Input To-Do Task" // Placeholder text
        value={value}                // Controlled input value
        onChange={(event) => setValue(event.currentTarget.value)} // Update state on typing
        onKeyPress={(event) => {
          // If user presses Enter, submit the task
          if (event.key === 'Enter') {
            handleSubmit();
          }
        }}
      />
      <Button
        size="md"
        radius="md"
        onClick={handleSubmit} // Submit task when button is clicked
        color="#006400"        // Dark green button color
      >
        Submit
      </Button>
    </Group>
  );
}