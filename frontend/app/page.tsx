'use client';
import { useListState } from '@mantine/hooks';
import { Center, Container, Text, useMantineColorScheme, UnstyledButton, Paper, Group } from "@mantine/core";
import { IconSun, IconMoon, IconPalette } from "@tabler/icons-react";
import { InputWithButton } from './input';
import { TodoList } from './list';
import { useEffect } from 'react';
import { useThemeContext } from './ThemeContext';

export default function Home() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { cyclePalette } = useThemeContext();
  const [todos, handlers] = useListState([]);

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      handlers.setState(JSON.parse(storedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const togglePin = (index: number) => {
    const pinnedCount = todos.filter((todo) => todo.pinned).length;
    if (pinnedCount < 3 || todos[index].pinned) {
      handlers.setItem(index, { ...todos[index], pinned: !todos[index].pinned });
    }
  };

  return (
    <Container size="sm" mt="xl">
      <Paper p="xl" radius="lg" shadow="md">
        <Group justify="space-between" mb="xl">
          <Text style={{ fontSize: '2rem' }} fw={700}>
            My To-do list
          </Text>
          <Group>
            <UnstyledButton onClick={cyclePalette} title="Cycle color palette">
              <IconPalette size="1.5rem" />
            </UnstyledButton>
            <UnstyledButton onClick={toggleColorScheme} title="Toggle color scheme">
              {colorScheme === 'dark' ? <IconSun size="1.5rem" /> : <IconMoon size="1.5rem" />}
            </UnstyledButton>
          </Group>
        </Group>
        <InputWithButton handlers={handlers} />
        <TodoList todos={todos} handlers={handlers} togglePin={togglePin} />
      </Paper>
    </Container>
  );
}
