'use client';

import { useState } from "react";

import { Center, Container, Text } from "@mantine/core";
import { IconRocket } from "@tabler/icons-react";
import {TextInput} from './input';
import { TodoList } from "./list";


export default function Home() {
  return (
    <Container w='100%' >
        <IconRocket/>
        <Text px={5} size='xl' >
          Your todo app goes here!
        </Text> 
        <IconRocket/>
      <TextInput></TextInput>
        <TodoList/>
    </Container>
  );
}
