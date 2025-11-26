'use client';
import { Center, Container, Text } from "@mantine/core";
import {TextInput} from './input';
import { TodoList } from "./list";


export default function Home() {
  return (
    <Container w='100%' > 
      <TextInput></TextInput>
        <TodoList/>
    </Container>
  );
}