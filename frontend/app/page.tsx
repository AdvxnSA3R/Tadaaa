'use client';

import { useState } from "react";

import { Center, Container, Text, useMantineColorScheme, UnstyledButton } from "@mantine/core";
import { IconRocket, IconSun, IconMoon } from "@tabler/icons-react";
import {TextInput} from './input';
import { TodoList } from "./list";


export default function Home() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  return (
    <Container w='100%' >
                <Center>
          <Text px={5} style={{ fontSize: '4rem', fontFamily: 'var(--font-poppins)' }} fw={700} >
            My To-do list
          </Text> 
        </Center>
        <UnstyledButton onClick={toggleColorScheme}>
          {colorScheme === 'dark' ? <IconSun size="1rem" /> : <IconMoon size="1rem" />}
        </UnstyledButton>
      <TextInput></TextInput>
        <TodoList/>
    </Container>
  );
}
