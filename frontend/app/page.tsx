'use client'; // Next.js directive to mark this component as a client-side component

import { useState, useEffect } from "react"; // React hooks for state and lifecycle
import { Center, Container, Text, Space, Divider } from "@mantine/core"; // Mantine UI components
import { TextInput } from './input'; // Custom input component for adding tasks
import { TodoList } from "./list";   // Custom list component for displaying tasks

export default function Home() {
  // State: holds an array of tasks, each with a name and unique key
  const [tasks, setTasks] = useState<{ name: string; key: string }[]>([]);

  // Function to add a new task
  const handleAddTask = (taskName: string) => {
    // Create a new task object with a random key
    const newTask = { name: taskName, key: Math.random().toString(36).substring(2, 9) };
    // Update state by appending the new task to the existing list
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  // Function to delete a task by its key
  const handleDeleteTask = (key: string) => {
    // Filter out the task with the matching key
    setTasks((prevTasks) => prevTasks.filter((task) => task.key !== key));
  };

  // Load tasks from localStorage when the component first mounts
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    setTasks(savedTasks);
  }, []);

  // Save tasks to localStorage whenever the tasks state changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  return (
    <Container w='100%'>
      {/* Centered title */}
      <Center>
        <Text fz={50} fw={700} c="white">
          To-Do List
        </Text>
      </Center>

      {/* Input component for adding new tasks */}
      <TextInput onAddTask={handleAddTask} />

      <Space h="md" /> {/* Adds vertical spacing */}
      <Divider my="md" /> {/* Horizontal divider line */}

      {/* List component to display tasks, with delete functionality */}
      <TodoList tasks={tasks} onDeleteTask={handleDeleteTask} />

      <Divider my="md" /> {/* Another divider for layout balance */}
    </Container>
  );
}