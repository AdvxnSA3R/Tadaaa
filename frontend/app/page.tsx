'use client';

import { useState } from "react";

import { Center, Container, Text, Space, Divider } from "@mantine/core";
import {TextInput} from './input';
import { TodoList } from "./list";


export default function Home() {
  const [tasks, setTasks] = useState<{ name: string; key: string }[]>([]);

  const handleAddTask = (taskName: string) => {
    const newTask = { name: taskName, key: Math.random().toString(36).substring(2, 9) };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleDeleteTask = (key: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.key !== key));
  };

  return (
    <Container w='100%' >
      <Center>
        <Text fz={50} fw={700} c="white" >
          To-Do List
        </Text>
      </Center>
      <TextInput onAddTask={handleAddTask}></TextInput>
      <Space h="md" />
      <Divider my="md" />
      <TodoList tasks={tasks} onDeleteTask={handleDeleteTask} />
      <Divider my="md" />
    </Container>
  );
}
